const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

let fbSession = {}; // temporary session store

cmd({
  pattern: "facebook",
  react: "🎥",
  alias: ["fbb", "fbvideo", "fb"],
  desc: "Download videos from Facebook",
  category: "download",
  use: '.facebook <facebook_url>',
  filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🚩 Please give me a facebook url");

    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(q)}`);
    if (!fb.result || (!fb.result.sd && !fb.result.hd)) {
      return reply("I couldn't find anything :(");
    }

    // save session
    fbSession[m.sender] = {
      sd: fb.result.sd,
      hd: fb.result.hd
    };

    let caption = `*🖥️ 𝐊ꜱᴍ𝐃 𝐅ᴀᴄᴇʙᴏᴏ𝐊 𝐃𝐋*

📝 TITLE : Facebook Video
🔗 URL : ${q}

Select quality:
1️⃣ SD Video
2️⃣ HD Video

➡️ Reply with number (1 or 2)`;

    if (fb.result.thumb) {
      await conn.sendMessage(from, {
        image: { url: fb.result.thumb },
        caption: caption
      }, { quoted: mek });
    } else {
      await reply(caption);
    }

  } catch (err) {
    console.error(err);
    reply("*ERROR*");
  }
});

// reply handler for SD/HD selection
cmd({
  on: "message"
}, async (conn, mek, m, { reply }) => {
  if (!fbSession[m.sender]) return;

  let choice = m.body.trim();
  if (choice === "1" && fbSession[m.sender].sd) {
    await reply("⬇️ Downloading *SD Video*...");
    await conn.sendMessage(m.chat, {
      video: { url: fbSession[m.sender].sd },
      mimetype: "video/mp4",
      caption: "✅ Here is your *SD video*"
    }, { quoted: mek });
    delete fbSession[m.sender];

  } else if (choice === "2" && fbSession[m.sender].hd) {
    await reply("⬇️ Downloading *HD Video*...");
    await conn.sendMessage(m.chat, {
      video: { url: fbSession[m.sender].hd },
      mimetype: "video/mp4",
      caption: "✅ Here is your *HD video*"
    }, { quoted: mek });
    delete fbSession[m.sender];
  }
});
