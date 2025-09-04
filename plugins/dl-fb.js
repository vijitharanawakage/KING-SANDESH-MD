const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

let fbSession = {}; // session storage

cmd({
  pattern: "facebook",
  react: "🎥",
  alias: ["fbb", "fbvideo", "fb"],
  desc: "Download videos from Facebook",
  category: "download",
  use: ".facebook <facebook_url>",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🚩 Please give me a Facebook url");

    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(q)}`);

    if (!fb.result || (!fb.result.sd && !fb.result.hd)) {
      return reply("I couldn't find anything :(");
    }

    // save session
    fbSession[m.sender] = {
      sd: fb.result.sd,
      hd: fb.result.hd
    };

    let caption = `*🖥️ KSMd Facebook DL*\n\n📝 TITLE : Facebook Video\n🔗 URL : ${q}\n\nSelect quality:\n1️⃣ SD Video\n2️⃣ HD Video\n\n➡️ Reply with number (1/2) or use the list below.`;

    // send list reply
    let sections = [
      {
        title: "Choose Quality",
        rows: []
      }
    ];

    if (fb.result.sd) {
      sections[0].rows.push({ title: "SD Video", rowId: "fb_sd" });
    }
    if (fb.result.hd) {
      sections[0].rows.push({ title: "HD Video", rowId: "fb_hd" });
    }

    await conn.sendMessage(from, {
      text: caption,
      footer: "Select one option",
      title: "Facebook Downloader",
      buttonText: "📥 Choose Quality",
      sections
    }, { quoted: mek });

  } catch (err) {
    console.error(err);
    reply("*ERROR*");
  }
});

// handler for number reply
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

// handler for list reply
cmd({
  on: "message"
}, async (conn, mek, m) => {
  if (!fbSession[m.sender]) return;
  let selected = m.listResponseMessage?.singleSelectReply?.selectedRowId;

  if (selected === "fb_sd" && fbSession[m.sender].sd) {
    await conn.sendMessage(m.chat, {
      video: { url: fbSession[m.sender].sd },
      mimetype: "video/mp4",
      caption: "✅ Here is your *SD video*"
    }, { quoted: mek });
    delete fbSession[m.sender];
  } else if (selected === "fb_hd" && fbSession[m.sender].hd) {
    await conn.sendMessage(m.chat, {
      video: { url: fbSession[m.sender].hd },
      mimetype: "video/mp4",
      caption: "✅ Here is your *HD video*"
    }, { quoted: mek });
    delete fbSession[m.sender];
  }
});
