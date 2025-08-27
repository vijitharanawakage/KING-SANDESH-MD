const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { default: downloader } = require("nodejs-file-downloader");
const config = require("../config");
const { cmd } = require("../command");

let session = {}; // for non-button mode

cmd({
  pattern: "phdl",
  react: "🔞",
  desc: "Search Pornhub videos and download",
  category: "adult",
  filename: __filename,
}, async (conn, mek, m, { args, reply, from }) => {
  const query = args.join(" ");
  if (!query) return reply("🔍 Please provide a search keyword.\nExample: `.phdl sex`");

  try {
    const searchUrl = `https://www.pornhub.com/video/search?search=${encodeURIComponent(query)}`;
    const res = await axios.get(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(res.data);
    const results = [];

    $("li.videoPreviewBlock").each((i, el) => {
      if (results.length >= 5) return;
      const a = $(el).find("a[href*='/view_video.php']").first();
      const href = a.attr("href");
      const title = a.attr("title") || a.text().trim();
      if (href && title) {
        results.push({
          title: title.trim(),
          url: "https://www.pornhub.com" + href.trim()
        });
      }
    });

    if (!results.length) return reply("🚫 No results found.");

    if (config.BUTTON === "true") {
      const buttons = results.map((v, i) => ({
        buttonId: `.phdlget ${encodeURIComponent(v.url)}`,
        buttonText: { displayText: `${i + 1}. ${v.title.slice(0, 30)}...` },
        type: 1
      }));

      return conn.sendMessage(from, {
        text: `🔞 *𝐒ᴇᴀʀᴄ𝐇 𝐑ᴇꜱᴜʟᴛ𝐒 𝐅ᴏ𝐑:* ${query}`,
        buttons,
        headerType: 1
      }, { quoted: mek });

    } else {
      session[from] = results;
      let msg = `🔞 *𝐒ᴇᴀʀᴄ𝐇 𝐑ᴇꜱᴜʟᴛ𝐒 𝐅ᴏ𝐑:* ${query}\n\n`;
      results.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n`;
      });
      msg += `\n📥 𝐑ᴇᴘʟʏ 𝐖ɪᴛʜ 𝐓ʜᴇ 𝐍ᴜᴍʙᴇʀ 𝐓ᴏ 𝐃ᴏᴡɴʟᴏᴀᴅ.`;
      return await reply(msg);
    }
  } catch (err) {
    console.error(err);
    return reply("❌ Failed to search Pornhub.");
  }
});

cmd({
  pattern: "phdlget",
  desc: "Download selected Pornhub video",
  category: "adult",
  filename: __filename,
}, async (conn, mek, m, { args, reply, from }) => {
  const url = args[0];
  if (!url || !url.includes("pornhub.com")) return reply("❌ Invalid video URL.");

  try {
    reply("📥 𝐅ᴇᴛᴄʜɪɴɢ 𝐕ɪᴅᴇᴏ...");

    const res = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(res.data);
    const json = $("script[type='application/ld+json']").html();
    const videoData = JSON.parse(json);
    const videoUrl = videoData.contentUrl;

    if (!videoUrl) return reply("🚫 Couldn't extract download URL.");

    const dl = new downloader({
      url: videoUrl,
      directory: "./",
      fileName: "phdl_video.mp4"
    });

    await dl.download();

    await conn.sendMessage(from, {
      video: fs.readFileSync("./phdl_video.mp4"),
      mimetype: "video/mp4",
      caption: videoData.name || "Pornhub Video"
    }, { quoted: mek });

    fs.unlinkSync("./phdl_video.mp4");

  } catch (err) {
    console.error(err);
    reply("❌ Failed to download or send video.");
  }
});

cmd({
  pattern: "^([1-5])$",
  desc: "Handle reply in non-button mode",
  onlyInReply: true,
  filename: __filename,
}, async (conn, mek, m, { match, reply, from }) => {
  if (!session[from]) return;
  const index = parseInt(match[1]) - 1;
  const selected = session[from][index];
  delete session[from];
  if (!selected) return reply("❌ Invalid selection.");
  conn.fakeMessage = mek;
  return conn.ev.emit("messages.upsert", {
    messages: [{
      key: mek.key,
      message: { conversation: `.phdlget ${selected.url}` }
    }],
    type: "notify"
  });
});
