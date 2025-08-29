const axios = require("axios");
const cheerio = require("cheerio");
const { cmd } = require("../command");

const MAX_WHATSAPP_SIZE = 64 * 1024 * 1024; // 64 MB

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

// Search command
cmd({
  pattern: "xhamster",
  react: "🔞",
  desc: "Search xHamster videos by query",
  category: "adult",
  use: ".xhamster <query>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    const query = args.join(" ").trim();
    if (!query) return reply("⚡ Query එකක් දෙන්න.\nඋදා: *.xhsearch indian milf*");

    await reply("🔎 Searching xHamster...");

    const searchUrl = `https://xhamster.com/search/${encodeURIComponent(query)}`;
    const html = await fetchHTML(searchUrl);
    const $ = cheerio.load(html);

    // collect video links
    const links = new Map();
    // try anchor selectors
    $('a').each((i, el) => {
      const href = $(el).attr('href');
      const title = $(el).attr('title') || $(el).text();
      if (!href) return;
      // typical video paths: /videos/<slug>-<id> or /video/<id>...
      if (/\/videos?\/[a-z0-9-]+/i.test(href)) {
        const full = href.startsWith('http') ? href : `https://xhamster.com${href}`;
        if (!links.has(full)) links.set(full, title.trim() || full);
      }
    });

    // fallback: search for video cards by data
    if (links.size === 0) {
      const regex = /href="(\/videos?\/[a-z0-9-]+)"/gi;
      let mch;
      while ((mch = regex.exec(html)) !== null && links.size < 20) {
        const full = `https://xhamster.com${mch[1]}`;
        if (!links.has(full)) links.set(full, full);
      }
    }

    const arr = Array.from(links.entries()).slice(0, 10);
    if (arr.length === 0) return reply("❌ Search results හමු නොවුණා.");

    let text = `🔞 *xHamster Search Results for:* ${query}\n\n`;
    arr.forEach(([url, title], i) => {
      const t = title.length > 80 ? title.slice(0, 77) + "..." : title;
      text += `*${i + 1}.* ${t}\n🔗 ${url}\n\n`;
    });
    text += `➡️ Use: *.xhamsterdl <video link>* to download (or reply with number to get link)`;

    await reply(text);

  } catch (err) {
    console.error("xhsearch error:", err);
    reply("❌ Search එකට දෝෂයක්. ටිකක් පසුව නැවත උත්සහ කරන්න.");
  }
});

// Download command
cmd({
  pattern: "xhamsterdl",
  react: "⬇️",
  desc: "Download xHamster video by URL",
  category: "adult",
  use: ".xhamsterdl <xhamster video link>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    let url = args[0];
    if (!url) return reply("⚡ Link එකක් දෙන්න.\nඋදා: *.xhvideo https://xhamster.com/videos/slug-123456*");

    // normalize
    if (!url.startsWith("http")) url = `https://${url}`;

    await reply("⏳ Fetching video page...");

    const html = await fetchHTML(url);

    // try OG metadata for thumbnail & title
    let title = (html.match(/<meta property="og:title" content="([^"]+)"/i) || [])[1] || "";
    let thumb = (html.match(/<meta property="og:image" content="([^"]+)"/i) || [])[1] || undefined;
    if (!title) {
      const t = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      title = t ? t[1].trim() : "xhamster_video";
    }

    // extract mp4 links (common pattern)
    // look for .mp4 urls in page (player config or sources)
    const mp4Regex = /https?:\/\/[^"'()\s]+\.mp4[^"'()\s]*/gi;
    const found = [];
    let mmp;
    while ((mmp = mp4Regex.exec(html)) !== null) {
      found.push(mmp[0]);
    }

    // also try JSON player config if present
    if (found.length === 0) {
      const cfgRegex = /"videoUrl"\s*:\s*"([^"]+\.mp4[^"]*)"/i;
      const cfg = html.match(cfgRegex);
      if (cfg && cfg[1]) found.push(cfg[1].replace(/\\u0026/g, '&').replace(/\\/g, ''));
    }

    // dedupe and prefer highest quality by choosing longest url or containing '1080'/'720'
    const unique = Array.from(new Set(found));
    if (unique.length === 0) return reply("❌ Direct MP4 link හමු නොවුණා. Manual open කරන්න: " + url);

    // prefer quality
    unique.sort((a, b) => {
      const qa = /1080|720|480|360/.exec(a) || [];
      const qb = /1080|720|480|360/.exec(b) || [];
      if (qa.length && !qb.length) return -1;
      if (!qa.length && qb.length) return 1;
      return b.length - a.length;
    });

    const videoUrl = unique[0];

    // check file size via HEAD
    let fileSize = 0;
    try {
      const head = await axios.head(videoUrl, { timeout: 15000 });
      fileSize = parseInt(head.headers['content-length'] || "0");
    } catch (e) {
      // ignore, proceed with link (might be remote host blocking HEAD)
    }

    const safeTitle = title.replace(/[^a-zA-Z0-9 ]/g, "_").slice(0, 64);
    const fileName = `${safeTitle}.mp4`;
    const caption = `🔞 *${title}*`;

    if (fileSize && fileSize > MAX_WHATSAPP_SIZE) {
      // too big: send direct link and thumbnail
      let msg = `⚠️ File size is too large for WhatsApp (${(fileSize / (1024*1024)).toFixed(2)} MB).\nDownload manually:\n${videoUrl}`;
      await conn.sendMessage(mek.chat, {
        text: msg
      }, { quoted: mek });
      return;
    }

    // send as document (Baileys supports streaming from URL)
    const sendObj = {
      document: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: fileName,
      caption: caption
    };

    // include thumbnail if available
    if (thumb) {
      try {
        const tRes = await axios.get(thumb, { responseType: "arraybuffer", timeout: 15000 });
        sendObj.jpegThumbnail = Buffer.from(tRes.data);
      } catch (e) {
        // ignore thumb fetch failures
      }
    }

    await conn.sendMessage(mek.chat, sendObj, { quoted: mek });

  } catch (err) {
    console.error("xhvideo error:", err);
    reply("❌ Video download/process එකේ දෝෂයක්. Link එක හරියෙන් තියෙනවද බලන්න.");
  }
});
