const express = require("express");
const cors = require("cors");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const archiver = require("archiver");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

// CORS — restrict to your frontend domain in production via FRONTEND_URL env var
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map((s) => s.trim())
  : true; // permissive in dev

app.use(cors({ origin: allowedOrigins, credentials: false }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: "Too many requests. Please wait before trying again.", retryAfter: 900 },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

function extractHashtags(text) {
  if (!text) return [];
  const matches = text.match(/#[\wÀ-ſ]+/g);
  return matches ? [...new Set(matches)] : [];
}

function parseTimestamp(ts) {
  if (!ts) return null;
  if (typeof ts === "number") return new Date(ts * 1000).toISOString();
  return ts;
}

function isValidInstagramUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      (parsed.hostname === "www.instagram.com" || parsed.hostname === "instagram.com") &&
      (parsed.pathname.includes("/p/") ||
        parsed.pathname.includes("/reel/") ||
        parsed.pathname.includes("/tv/"))
    );
  } catch {
    return false;
  }
}

// Decode HTML entities — handles named, numeric (decimal & hex), surrogate pairs
function decodeEntities(str) {
  if (!str) return "";
  return str
    .replace(/&#x([\da-f]+);/gi, (_, h) => {
      const cp = parseInt(h, 16);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : "";
    })
    .replace(/&#(\d+);/g, (_, n) => {
      const cp = parseInt(n, 10);
      return Number.isFinite(cp) ? String.fromCodePoint(cp) : "";
    })
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

// ─── Instagram HTML scraper for caption / username (no API needed) ───────────
// Instagram embeds post data in og:* meta tags + JSON-LD scripts on every public page.
async function scrapePostMetadata(url) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "en-US,en;q=0.9",
      },
      timeout: 10000,
      maxRedirects: 5,
    });

    const html = res.data;
    const meta = (prop) => {
      const re = new RegExp(`<meta[^>]+property=["']${prop}["'][^>]+content=["']([^"']+)["']`, "i");
      const m = html.match(re);
      return m ? decodeEntities(m[1]) : null;
    };

    const ogTitle = meta("og:title") || "";
    const ogDescription = meta("og:description") || "";
    const ogImage = meta("og:image") || null;

    // og:title format: 'USERNAME on Instagram: "caption..."'
    // og:description format: '12K likes, 234 comments — USERNAME on April 23, 2026: "caption"'
    let username = null;
    let caption = null;
    let likesCount = null;
    let timestamp = null;

    // Username — try @username first, then fallback to "name on Instagram", then URL
    let userMatch = ogTitle.match(/\(@([\w.]+)\)/);
    if (!userMatch) userMatch = ogDescription.match(/[—-]\s*([\w.]+)\s+on/);
    if (!userMatch) userMatch = ogTitle.match(/^([\w.]+)\s+on Instagram/i);
    if (userMatch) username = userMatch[1];

    // Caption — text inside any straight or smart quotes, anywhere in og:title or og:description
    const QUOTE_RE = /["“”„«]([\s\S]{3,}?)["“”»]/;
    let capMatch = ogTitle.match(QUOTE_RE);
    if (!capMatch) capMatch = ogDescription.match(QUOTE_RE);
    if (capMatch) caption = capMatch[1].trim();

    // Likes / date / fallback caption from og:description
    if (ogDescription) {
      const likesMatch = ogDescription.match(/([\d,]+(?:\.\d+)?[KMB]?)\s+likes?/i);
      if (likesMatch) {
        const v = likesMatch[1].replace(/,/g, "");
        if (/[KMB]$/i.test(v)) {
          const num = parseFloat(v);
          const mult = { K: 1e3, M: 1e6, B: 1e9 }[v.slice(-1).toUpperCase()];
          likesCount = Math.round(num * mult);
        } else {
          likesCount = parseInt(v, 10) || null;
        }
      }
      const dateMatch = ogDescription.match(/on\s+([A-Z][a-z]+ \d+,? \d{4})/);
      if (dateMatch) {
        const d = new Date(dateMatch[1]);
        if (!isNaN(d)) timestamp = d.toISOString();
      }
    }

    return { username, caption, likesCount, timestamp, profilePic: ogImage };
  } catch (err) {
    console.warn("[Scraper] meta scrape failed:", err.message);
    return null;
  }
}

// ─── RapidAPI: try multiple endpoints in order ───────────────────────────────

async function rapidGet(host, path, params, key) {
  const response = await axios.get(`https://${host}${path}`, {
    params,
    headers: { "X-RapidAPI-Key": key, "X-RapidAPI-Host": host },
    timeout: 15000,
  });
  return response.data;
}

// instagram-downloader-download-instagram-stories-videos4  (the one you subscribed to)
// Actual response: { media: [{ type, quality, thumbnail, url }, ...] }
async function tryDownloaderV4(url, key) {
  const HOST = "instagram-downloader-download-instagram-stories-videos4.p.rapidapi.com";
  const data = await rapidGet(HOST, "/convert", { url }, key);

  if (!data) throw new Error("v4: empty response");

  const rawMedia = data.media || data.links || data.medias || [];
  if (!rawMedia.length) throw new Error("v4: no media array in response");

  // De-duplicate by URL — the API sometimes returns HD + SD of the same clip
  const seen = new Set();
  const mediaItems = [];
  rawMedia.forEach((m, i) => {
    const src = m.url || m.link || m.src;
    if (!src || seen.has(src)) return;
    seen.add(src);
    const isVideo = m.type === "video" || (src || "").includes(".mp4");
    mediaItems.push({
      id: `media_${i}`,
      type: isVideo ? "video" : "image",
      url: src,
      thumbnail: m.thumbnail || data.thumbnail || null,
    });
  });

  if (!mediaItems.length) throw new Error("v4: all media items were empty/duplicate");

  const caption = data.caption || data.title || "";
  return {
    username: data.username || data.ownerUsername || "unknown",
    profilePic: data.profilePicture || data.ownerProfilePic || null,
    caption,
    hashtags: extractHashtags(caption),
    mediaItems,
    likesCount: data.likes ?? data.likeCount ?? null,
    timestamp: parseTimestamp(data.timestamp || data.takenAt || null),
    postUrl: url,
  };
}

// instagram-scraper-api2  →  most popular free-tier API
async function tryScraperApi2(url, key) {
  const data = await rapidGet(
    "instagram-scraper-api2.p.rapidapi.com",
    "/v1/post_info",
    { code_or_id_or_url: url },
    key
  );

  const item = data?.data?.items?.[0];
  if (!item) throw new Error("scraper-api2: no item in response");

  const mediaItems = [];
  const nodes = item.carousel_media || [item];
  nodes.forEach((m, i) => {
    if (m.video_versions?.length) {
      mediaItems.push({
        id: `media_${i}`, type: "video",
        url: m.video_versions[0].url,
        thumbnail: m.image_versions2?.candidates?.[0]?.url || null,
      });
    } else {
      const imgUrl = m.image_versions2?.candidates?.[0]?.url || m.display_url;
      mediaItems.push({ id: `media_${i}`, type: "image", url: imgUrl, thumbnail: imgUrl });
    }
  });

  const caption = item.caption?.text || "";
  return {
    username: item.user?.username || "unknown",
    profilePic: item.user?.profile_pic_url || null,
    caption, hashtags: extractHashtags(caption), mediaItems,
    likesCount: item.like_count ?? null,
    timestamp: parseTimestamp(item.taken_at),
    postUrl: url,
  };
}

// instagram-looter2
async function tryLooter2(url, key) {
  const data = await rapidGet(
    "instagram-looter2.p.rapidapi.com",
    "/post",
    { url },
    key
  );

  if (!data) throw new Error("looter2: empty response");

  const mediaItems = [];
  const rawMedia = data.medias || data.media || [];
  (Array.isArray(rawMedia) ? rawMedia : [rawMedia]).forEach((m, i) => {
    const isVideo = m.type === "video" || !!m.videoUrl;
    mediaItems.push({
      id: `media_${i}`,
      type: isVideo ? "video" : "image",
      url: m.videoUrl || m.url || m.imageUrl || m.src,
      thumbnail: m.imageUrl || m.thumbnail || null,
    });
  });

  if (mediaItems.length === 0 && data.url) {
    mediaItems.push({ id: "media_0", type: "image", url: data.url, thumbnail: data.url });
  }

  const caption = data.caption || data.text || "";
  return {
    username: data.ownerUsername || data.username || "unknown",
    profilePic: data.ownerProfilePic || data.profilePic || null,
    caption, hashtags: extractHashtags(caption), mediaItems,
    likesCount: data.likeCount ?? data.likes ?? null,
    timestamp: parseTimestamp(data.timestamp || data.takenAt),
    postUrl: url,
  };
}

// instagram-media-downloader
async function tryMediaDownloader(url, key) {
  const data = await rapidGet(
    "instagram-media-downloader.p.rapidapi.com",
    "/rapid/post",
    { url },
    key
  );

  if (!data) throw new Error("media-downloader: empty response");

  const mediaItems = [];
  const items = data.medias || data.items || (data.url ? [data] : []);
  items.forEach((m, i) => {
    const isVideo = m.type === "video" || (m.url || "").includes(".mp4");
    mediaItems.push({
      id: `media_${i}`,
      type: isVideo ? "video" : "image",
      url: m.url,
      thumbnail: m.thumbnail || m.thumb || null,
    });
  });

  const caption = data.caption || "";
  return {
    username: data.username || "unknown",
    profilePic: data.profilePicUrl || null,
    caption, hashtags: extractHashtags(caption), mediaItems,
    likesCount: data.likeCount ?? null,
    timestamp: parseTimestamp(data.timestamp),
    postUrl: url,
  };
}

// social-media-video-downloader (last resort RapidAPI)
async function trySocialMediaDownloader(url, key) {
  const data = await rapidGet(
    "social-media-video-downloader.p.rapidapi.com",
    "/smvd/get/all",
    { url },
    key
  );

  if (!data?.links?.length) throw new Error("smvd: no links in response");

  const best = data.links.find((l) => l.quality === "hd" || l.quality === "sd") || data.links[0];
  const isVideo = (best.type || "").includes("video") || (best.url || "").includes(".mp4");
  return {
    username: data.meta?.title || "unknown",
    profilePic: null,
    caption: data.meta?.description || "",
    hashtags: extractHashtags(data.meta?.description || ""),
    mediaItems: [{ id: "media_0", type: isVideo ? "video" : "image", url: best.url, thumbnail: data.thumbnail || null }],
    likesCount: null,
    timestamp: null,
    postUrl: url,
  };
}

async function fetchViaRapidAPI(url) {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new Error("RAPIDAPI_KEY not configured");

  const attempts = [
    ["instagram-downloader-v4", () => tryDownloaderV4(url, key)],
    ["instagram-scraper-api2", () => tryScraperApi2(url, key)],
    ["instagram-looter2", () => tryLooter2(url, key)],
    ["instagram-media-downloader", () => tryMediaDownloader(url, key)],
    ["social-media-video-downloader", () => trySocialMediaDownloader(url, key)],
  ];

  for (const [name, fn] of attempts) {
    try {
      const result = await fn();
      if (result?.mediaItems?.length) {
        console.log(`[RapidAPI] success via ${name}`);
        return result;
      }
    } catch (err) {
      console.warn(`[RapidAPI] ${name} failed: ${err.response?.status || err.message}`);
    }
  }

  throw new Error("All RapidAPI endpoints failed or returned no media");
}

// Fallback scraper using instagram public JSON endpoint
async function fetchViaInstagramPublic(url) {
  // Extract shortcode from URL
  const match = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) throw new Error("Could not extract post shortcode from URL");

  const shortcode = match[2];
  const apiUrl = `https://www.instagram.com/p/${shortcode}/?__a=1&__d=dis`;

  const response = await axios.get(apiUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
      "Accept": "application/json",
      "Accept-Language": "en-US,en;q=0.9",
      "Cookie": process.env.INSTAGRAM_COOKIE || "",
    },
    timeout: 10000,
  });

  return response.data;
}

function parseInstagramPublicResponse(data, url) {
  const item = data.items?.[0] || data.graphql?.shortcode_media;
  if (!item) throw new Error("Could not parse Instagram response");

  const mediaItems = [];

  if (item.carousel_media) {
    item.carousel_media.forEach((m, i) => {
      if (m.video_versions) {
        mediaItems.push({
          id: `media_${i}`,
          type: "video",
          url: m.video_versions[0].url,
          thumbnail: m.image_versions2?.candidates?.[0]?.url || null,
        });
      } else {
        mediaItems.push({
          id: `media_${i}`,
          type: "image",
          url: m.image_versions2?.candidates?.[0]?.url || m.display_url,
          thumbnail: m.image_versions2?.candidates?.[0]?.url || m.display_url,
        });
      }
    });
  } else if (item.video_versions || item.video_url) {
    mediaItems.push({
      id: "media_0",
      type: "video",
      url: item.video_versions?.[0]?.url || item.video_url,
      thumbnail: item.image_versions2?.candidates?.[0]?.url || item.display_url || null,
    });
  } else {
    mediaItems.push({
      id: "media_0",
      type: "image",
      url: item.image_versions2?.candidates?.[0]?.url || item.display_url,
      thumbnail: item.image_versions2?.candidates?.[0]?.url || item.display_url,
    });
  }

  const caption =
    item.caption?.text ||
    item.edge_media_to_caption?.edges?.[0]?.node?.text ||
    "";

  return {
    username: item.user?.username || item.owner?.username || "unknown",
    profilePic:
      item.user?.profile_pic_url ||
      item.owner?.profile_pic_url ||
      null,
    caption,
    hashtags: extractHashtags(caption),
    mediaItems,
    likesCount:
      item.like_count ||
      item.edge_media_preview_like?.count ||
      null,
    timestamp: parseTimestamp(item.taken_at || item.taken_at_timestamp || null),
    postUrl: url,
  };
}

app.post("/api/extract", async (req, res) => {
  const { url } = req.body;

  if (!url || typeof url !== "string") {
    return res.status(400).json({ error: "URL is required" });
  }

  const cleanUrl = url.trim();

  if (!isValidInstagramUrl(cleanUrl)) {
    return res.status(400).json({
      error: "Invalid Instagram URL. Please paste a valid post, reel, or IGTV link.",
    });
  }

  let result = null;
  let lastError = null;

  // Run RapidAPI (media) and HTML scraper (caption / username) in PARALLEL
  const [mediaSettled, metaSettled] = await Promise.allSettled([
    process.env.RAPIDAPI_KEY ? fetchViaRapidAPI(cleanUrl) : Promise.reject(new Error("no key")),
    scrapePostMetadata(cleanUrl),
  ]);

  if (mediaSettled.status === "fulfilled") {
    result = mediaSettled.value;
  } else {
    lastError = mediaSettled.reason;
    console.warn("RapidAPI failed:", lastError?.message);
  }

  // Fallback to public Instagram API if RapidAPI failed entirely
  if (!result) {
    try {
      const rawData = await fetchViaInstagramPublic(cleanUrl);
      result = parseInstagramPublicResponse(rawData, cleanUrl);
    } catch (err) {
      lastError = err;
      console.warn("Public API failed:", err.message);
    }
  }

  // Merge scraped metadata into the result — fills in caption / username / likes / date
  if (result && metaSettled.status === "fulfilled" && metaSettled.value) {
    const meta = metaSettled.value;
    if (meta.caption && !result.caption) {
      result.caption = meta.caption;
      result.hashtags = extractHashtags(meta.caption);
    }
    if (meta.username && (!result.username || result.username === "unknown")) {
      result.username = meta.username;
    }
    if (meta.likesCount && !result.likesCount) result.likesCount = meta.likesCount;
    if (meta.timestamp && !result.timestamp) result.timestamp = meta.timestamp;
    if (meta.profilePic && !result.profilePic) result.profilePic = meta.profilePic;
  }

  if (!result) {
    const errMsg = lastError?.response?.status === 404
      ? "Post not found. It may have been deleted or the URL is incorrect."
      : lastError?.response?.status === 403 || lastError?.response?.status === 401
      ? "This account is private or the post is restricted."
      : "Failed to extract media. Instagram may be temporarily blocking requests. Please try again later.";

    return res.status(500).json({ error: errMsg });
  }

  if (!result.mediaItems || result.mediaItems.length === 0) {
    return res.status(404).json({
      error: "No downloadable media found. The post may be private or removed.",
    });
  }

  res.json(result);
});

// Proxy endpoint — streams Instagram CDN media through the server to avoid CORS + trigger download
app.get("/api/proxy", async (req, res) => {
  const { url, filename } = req.query;
  if (!url) return res.status(400).json({ error: "URL required" });

  // Express already decodes query params — do NOT decodeURIComponent again or signed CDN URLs break
  const targetUrl = url;
  const safeFilename = filename || "instagram_media";

  const HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Encoding": "gzip, deflate, br",
    "Referer": "https://www.instagram.com/",
    "Origin": "https://www.instagram.com",
    "Sec-Fetch-Dest": "video",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "cross-site",
  };

  try {
    const response = await axios.get(targetUrl, {
      headers: HEADERS,
      responseType: "stream",
      timeout: 60000,
      maxRedirects: 5,
    });

    const contentType = response.headers["content-type"] || "application/octet-stream";
    const contentLength = response.headers["content-length"];

    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${safeFilename}"`);
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (contentLength) res.setHeader("Content-Length", contentLength);

    response.data.pipe(res);

    response.data.on("error", (err) => {
      console.error("Stream error:", err.message);
      if (!res.headersSent) res.status(500).json({ error: "Stream failed" });
    });
  } catch (err) {
    console.error("Proxy error:", err.message);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to fetch media: " + err.message });
    }
  }
});

// Download all as zip
app.post("/api/download-all", async (req, res) => {
  const { mediaItems, username } = req.body;

  if (!mediaItems || !Array.isArray(mediaItems) || mediaItems.length === 0) {
    return res.status(400).json({ error: "No media items provided" });
  }

  const archive = archiver("zip", { zlib: { level: 6 } });
  const filename = `instagram_${username || "media"}_${Date.now()}.zip`;

  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
  archive.pipe(res);

  for (let i = 0; i < mediaItems.length; i++) {
    const item = mediaItems[i];
    try {
      const response = await fetch(item.url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
          "Referer": "https://www.instagram.com/",
        },
      });
      if (!response.ok) continue;
      const ext = item.type === "video" ? "mp4" : "jpg";
      archive.append(response.body, { name: `media_${i + 1}.${ext}` });
    } catch {
      // skip failed items
    }
  }

  await archive.finalize();
});

app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
