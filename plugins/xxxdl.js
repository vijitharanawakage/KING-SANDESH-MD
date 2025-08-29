const axios = require("axios");
const cheerio = require("cheerio");
const { cmd } = require("../command");

const MAX_WHATSAPP_SIZE = 64 * 1024 * 1024; // 64 MB

// Store search sessions per chat
let searchSessions = {};

// Helper: fetch HTML
async function fetchHTML(url) {
  const res = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
    },
    timeout: 20000
  });
  return res.data;
}

// ─── SEARCH COMMAND ─────────────────────────────
cmd({
  pattern: "xhsearch",
  react: "🔞",
  desc: "Search xHamster videos by query",
  category: "adult",
  use: ".xhsearch <query>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    const query = args.join(" ").trim();
    if (!query) return reply("⚡ Query එකක් දෙන්න.\nඋදා: *.xhsearch indian milf*");

    await reply("🔎 Searching xHamster...");

    const searchUrl = `https://xhamster.com/search/${encodeURIComponent(query)}`;
    const html = await fetchHTML(searchUrl);
    const $ = cheerio.load(html);

    let results = [];
    $(".video-thumb").each((i, el) => {
      const link = $(el).find("a").attr("href");
      const title = $(el).find("a").attr("title") || $(el).find("a").text();
      const img = $(el).find("img").attr("src") || $(el).find("img").attr("data-src");
      if (link && title) {
        results.push({
          url: link.startsWith("http") ? link : `https://xhamster.com${link}`,
          title: title.trim(),
          thumb: img
        });
      }
    });

    if (results.length === 0) return reply("❌ Search results හමු නොවුණා.");

    results = results.slice(0, 10); // limit 10
    searchSessions[mek.chat] = results; // Save for reply handling

    // Send numbered results with images
    for (let i = 0; i < results.length; i++) {
      const r = results[i];
      await conn.sendMessage(mek.chat, {
        image: { url: r.thumb },
        caption: `*${i + 1}.* ${r.title}\n🔗 ${r.url}\n\n👉 Reply with *${i + 1}* to download`
      }, { quoted: mek });
    }

  } catch (err) {
    console.error("xhsearch error:", err);
    reply("❌ Search එකට දෝෂයක්. ටිකක් පසුව නැවත උත්සහ කරන්න.");
  }
});

// ─── DOWNLOAD BY URL ─────────────────────────────
async function handleDownload(conn, mek, url, reply) {
  try {
    await reply("⏳ Fetching video page...");

    const html = await fetchHTML(url);

    let title = (html.match(/<meta property="og:title" content="([^"]+)"/i) || [])[1] || "xhamster_video";
    let thumb = (html.match(/<meta property="og:image" content="([^"]+)"/i) || [])[1];

    // find mp4 links
    const mp4Regex = /https?:\/\/[^"'()\s]+\.mp4[^"'()\s]*/gi;
    const found = [];
    let m;
    while ((m = mp4Regex.exec(html)) !== null) found.push(m[0]);

    // JSON config fallback
    if (found.length === 0) {
      const cfgRegex = /"videoUrl"\s*:\s*"([^"]+\.mp4[^"]*)"/i;
      const cfg = html.match(cfgRegex);
      if (cfg && cfg[1]) found.push(cfg[1].replace(/\\u0026/g, '&').replace(/\\/g, ''));
    }

    const unique = Array.from(new Set(found));
    if (unique.length === 0) return reply("❌ Direct MP4 link හමු නොවුණා. Manual open කරන්න: " + url);

    // prefer HQ
    unique.sort((a, b) => b.length - a.length);
    const videoUrl = unique[0];

    // check size
    let fileSize = 0;
    try {
      const head = await axios.head(videoUrl, { timeout: 15000 });
      fileSize = parseInt(head.headers['content-length'] || "0");
    } catch {}

    const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, "_").slice(0, 64);
    const fileName = `${safeTitle}.mp4`;
    const caption = `🔞 *${title}*`;

    if (fileSize && fileSize > MAX_WHATSAPP_SIZE) {
      return reply(`⚠️ File too large for WhatsApp (${(fileSize / (1024*1024)).toFixed(2)} MB)\n📥 Download: ${videoUrl}`);
    }

    const sendObj = {
      document: { url: videoUrl },
      mimetype: "video/mp4",
      fileName,
      caption
    };

    if (thumb) {
      try {
        const tRes = await axios.get(thumb, { responseType: "arraybuffer" });
        sendObj.jpegThumbnail = Buffer.from(tRes.data);
      } catch {}
    }

    await conn.sendMessage(mek.chat, sendObj, { quoted: mek });

  } catch (err) {
    console.error("xhvideo error:", err);
    reply("❌ Video download error!");
  }
}

// ─── XHVIDEO COMMAND ─────────────────────────────
cmd({
  pattern: "xhvideo",
  react: "⬇️",
  desc: "Download xHamster video by URL",
  category: "adult",
  use: ".xhvideo <xhamster video link>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  let url = args[0];
  if (!url) return reply("⚡ Link එකක් දෙන්න.\nඋදා: *.xhvideo https://xhamster.com/videos/...*");
  if (!url.startsWith("http")) url = "https://" + url;
  await handleDownload(conn, mek, url, reply);
});

// ─── AUTO-REPLY HANDLER ─────────────────────────────
cmd({
  on: "text"
}, async (conn, mek, m, { body, reply }) => {
  if (!searchSessions[mek.chat]) return;

  const num = parseInt(body.trim());
  if (!num || num < 1 || num > searchSessions[mek.chat].length) return;

  const video = searchSessions[mek.chat][num - 1];
  delete searchSessions[mek.chat]; // clear session
  await handleDownload(conn, mek, video.url, reply);
});
