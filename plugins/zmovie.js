const axios = require("axios");
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "zmovie",
  react: "🎬",
  desc: "Search and download Sinhala Sub movies from Zoom.lk",
  category: "download",
  use: ".zmovie <movie name>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    const query = args.join(" ");
    if (!query) return reply("⚡ දාන්න ඕනෙ film name එක.\nඋදා: *.zmovie Bad Newz*");

    const searchUrl = `https://supun-md-api-xmjh.vercel.app/api/zoom-search?q=${encodeURIComponent(query)}`;
    const { data } = await axios.get(searchUrl);

    if (!data.results || data.results.length === 0) {
      return reply("❌ Movie එකක් හමු නොවුණා!");
    }

    let txt = `🎬 *Zoom Movie Search Results* 🎬\n\n`;
    data.results.forEach((res, i) => {
      txt += `*${i+1}.* ${res.title}\n👤 ${res.author}\n💬 Comments: ${res.comments}\n🔗 Link: ${res.link}\n\n`;
    });
    txt += `\n➡️ Use: *.zdl <movie link>* to download`;

    await reply(txt);

  } catch (e) {
    console.log(e);
    reply("❌ Error occurred while searching movie.");
  }
});

cmd({
  pattern: "zdl",
  react: "⬇️",
  desc: "Download Sinhala Subtitle Movies from Zoom.lk",
  category: "download",
  use: ".zdl <zoom.lk movie link>",
  filename: __filename
}, async (conn, mek, m, { args, reply }) => {
  try {
    const url = args[0];
    if (!url) return reply("⚡ දාන්න ඕනෙ Zoom.lk link එක.\nඋදා: *.zdl https://zoom.lk/...*");

    const dlUrl = `https://supun-md-api-xmjh.vercel.app/api/zoom-dl?url=${encodeURIComponent(url)}`;
    const { data } = await axios.get(dlUrl);

    if (!data.results || !data.results.dl_link) {
      return reply("❌ Download link not found!");
    }

    let cap = `🎬 *${data.results.title}*\n\n`;
    cap += `📅 Date: ${data.results.date}\n`;
    cap += `👁️ Views: ${data.results.view}\n`;
    cap += `💾 Size: ${data.results.size}\n`;

    // File name & extension detect
    let dlLink = data.results.dl_link;
    let ext = path.extname(dlLink).toLowerCase();
    let filename = `${data.results.title || "movie"}${ext}`;
    let filePath = path.join(__dirname, "../tmp", filename);

    // Download file
    const response = await axios.get(dlLink, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, response.data);

    // Decide send type
    if (ext === ".mp4" || ext === ".mkv" || ext === ".avi") {
      // send as video document
      await conn.sendMessage(mek.chat, {
        document: fs.readFileSync(filePath),
        mimetype: "video/mp4",
        fileName: filename,
        caption: cap
      }, { quoted: mek });
    } else {
      // send as normal document
      await conn.sendMessage(mek.chat, {
        document: fs.readFileSync(filePath),
        mimetype: "application/octet-stream",
        fileName: filename,
        caption: cap
      }, { quoted: mek });
    }

    fs.unlinkSync(filePath);

  } catch (e) {
    console.log(e);
    reply("❌ Error occurred while fetching or sending download.");
  }
});
