const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const { default: downloader } = require("nodejs-file-downloader");
const config = require("../config");
const { cmd } = require("../command");

let session = {}; // for CLI reply mode

cmd({
  pattern: "xxxdl ?(.*)",
  react: "🔞",
  desc: "Search and download videos from XHamster",
  category: "adult",
  filename: __filename,
}, async (conn, mek, m, { args, reply, from }) => {
  const query = args.join(" ");
  if (!query) return reply("🔍 Please provide a search keyword.\nExample: `.xxxdl fuck`");

  try {
    const searchUrl = `https://xhamster.com/search/${encodeURIComponent(query)}`;
    const res = await axios.get(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(res.data);
    const results = [];

    $("a.video-thumb__image-container").each((i, el) => {
      if (results.length >= 5) return;
      const url = "https://xhamster.com" + $(el).attr("href");
      const title = $(el).attr("title") || $(el).find("img").attr("alt");
      if (url && title) {
        results.push({ title: title.trim(), url });
      }
    });

    if (!results.length) return reply("🚫 No results found on XHamster.");

    if (config.BUTTON === "true") {
      const buttons = results.map((v, i) => ({
        buttonId: `.xxxget ${encodeURIComponent(v.url)}`,
        buttonText: { displayText: `${i + 1}. ${v.title.slice(0, 30)}...` },
        type: 1
      }));

      return conn.sendMessage(from, {
        text: `🔞 *𝐗𝐇ᴀᴍꜱᴛᴇ𝐑 𝐑ᴇꜱᴜʟ𝐓 𝐅ᴏ𝐑:* ${query}`,
        buttons,
        headerType: 1
      }, { quoted: mek });

    } else {
      session[from] = results;
      let msg = `🔞 *𝐗𝐇ᴀᴍꜱᴛᴇ𝐑 𝐑ᴇꜱᴜʟ𝐓 𝐅ᴏ𝐑:* ${query}\n\n`;
      results.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n`;
      });
      msg += `\n📥 𝐑ᴇᴘʟʏ 𝐖ɪᴛʜ 𝐓ʜᴇ 𝐍ᴜᴍʙᴇʀ 𝐓ᴏ 𝐃ᴏᴡɴʟᴏᴀᴅ.`;
      return reply(msg);
    }
  } catch (err) {
    console.error(err);
    return reply("❌ Failed to fetch results from XHamster.");
  }
});

cmd({
  pattern: "xxxget ?(.*)",
  desc: "Download selected XHamster video",
  category: "adult",
  filename: __filename,
}, async (conn, mek, m, { args, reply, from }) => {
  const url = args[0];
  if (!url || !url.includes("xhamster.com")) return reply("❌ Invalid video URL.");

  try {
    reply("📥 𝙵𝙴𝚃𝙲𝙷𝙸𝙽𝙶 𝚇𝙷𝙰𝙼𝚂𝚃𝙴𝚁 𝚅𝙸𝙳𝙴𝙾...");

    const res = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const $ = cheerio.load(res.data);
    const scriptTag = $("script#__NEXT_DATA__").html();
    const json = JSON.parse(scriptTag);
    const videoUrl = json.props.pageProps.video.sources?.mp4?.[0]?.link;

    if (!videoUrl) return reply("🚫 Couldn't extract download URL.");

    const dl = new downloader({
      url: videoUrl,
      directory: "./",
      fileName: "xhamster_video.mp4"
    });

    await dl.download();

    await conn.sendMessage(from, {
      video: fs.readFileSync("./xhamster_video.mp4"),
      mimetype: "video/mp4",
      caption: "🎬 Ｄᴏᴡɴʟᴏᴀᴅᴇᴅ Ｆʀᴏᴍ ＸＨᴀᴍꜱᴛᴇʀ\n\n𝚄𝚂𝙴 𝚃𝙷𝙸𝚂 𝙲𝙾𝙼𝙼𝙰𝙽𝙳 𝙻𝙸𝙺𝙴 𝚁𝙴𝙰𝙻 𝙶𝙴𝙽𝚃𝙻𝙴𝙼𝙰𝙽 🫡\n\n> *© Powered By King-Sandesh Md V2 💸*"
    }, { quoted: mek });

    fs.unlinkSync("./xhamster_video.mp4");

  } catch (err) {
    console.error(err);
    reply("❌ Failed to download or send video.");
  }
});

cmd({
  pattern: "^([1-5])$",
  desc: "Handle CLI reply in non-button mode for XHamster",
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
      message: { conversation: `.xxxget ${selected.url}` }
    }],
    type: "notify"
  });
});
