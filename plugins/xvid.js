const axios = require("axios");
const fileType = require("file-type");
const { cmd } = require("../command");

cmd({
  pattern: "xsearch ?(.*)",
  react: "🔞",
  desc: "Search adult videos from xnxx",
  category: "adult",
  use: ".xsearch <query>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  const query = args.join(" ");
  if (!query) return reply("⚡ Please provide a search query!\nExample: *.xsearch big boobs*");

  await reply("🔍 Searching videos...");

  try {
    const api = `https://api-aswin-sparky.koyeb.app/api/search/xnxx?search=${encodeURIComponent(query)}`;
    const { data } = await axios.get(api);

    if (!data?.status || !data.result?.status || !Array.isArray(data.result.result)) {
      return reply("❌ Failed to fetch search results!");
    }

    const results = data.result.result;
    if (results.length === 0) {
      return reply("❌ No videos found for your query!");
    }

    let txt = `🔞 *Search Results for:* ${query}\n\n`;
    results.slice(0, 10).forEach((v, i) => {
      txt += `*${i + 1}.* ${v.title}\n${v.info.replace(/\n/g, " ").trim()}\n🔗 ${v.link}\n\n`;
    });
    txt += `➡️ Use: *.xvideo <link>* to download`;

    await reply(txt);

  } catch (e) {
    console.log("XNXX Search Error:", e);
    reply("❌ Error occurred while searching videos.");
  }
});

cmd({
  pattern: "xvideo ?(.*)",
  react: "⬇️",
  desc: "Download adult video from xnxx",
  category: "adult",
  use: ".xvideo <link>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  const url = args[0];
  if (!url) return reply("⚡ Please provide a valid xnxx URL!\nExample: *.xvideo https://www.xvideos.com/videoXXXXX/title*");

  await reply("⏳ Fetching video details...");

  try {
    const api = `https://api-aswin-sparky.koyeb.app/api/downloader/xnxx?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(api);

    if (!data?.status || !data.data?.files) {
      return reply("❌ Failed to fetch video. Try another link!");
    }

    const videoData = data.data;
    const videoUrl = videoData.files.high || videoData.files.low;
    if (!videoUrl) return reply("❌ No downloadable video found!");

    const title = videoData.title || "xnxx_video";
    const duration = videoData.duration || "Unknown";

    let caption = `🔞 *${title}*\n⏱ Duration: ${duration} sec`;

    // File size check
    let fileSize = 0;
    try {
      const head = await axios.head(videoUrl);
      fileSize = parseInt(head.headers["content-length"] || "0");
    } catch { }

    const maxSize = 64 * 1024 * 1024; // 64MB WhatsApp limit
    if (fileSize && fileSize > maxSize) {
      return reply(`⚠️ File too large for WhatsApp!\nDownload manually:\n${videoUrl}`);
    }

    await conn.sendMessage(mek.chat, {
      document: { url: videoUrl },
      mimetype: "video/mp4",
      fileName: `${title.replace(/[^a-zA-Z0-9]/g, "_").slice(0, 32)}.mp4`,
      caption: caption
    }, { quoted: mek });

  } catch (e) {
    console.log("XNXX Download Error:", e);
    reply("❌ Error occurred while downloading video.");
  }
});
