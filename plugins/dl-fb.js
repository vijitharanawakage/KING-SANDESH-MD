const axios = require("axios");
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const config = require('../config');

const api = `https://nethu-api-ashy.vercel.app`;

cmd({
  pattern: "facebook",
  react: "🎥",
  alias: ["fbb", "fbvideo", "fb"],
  desc: "Download videos from Facebook",
  category: "download",
  use: '.facebook <facebook_url>',
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    if (!q) return reply("🚩 Please give me a facebook url");

    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(q)}`);

    if (!fb.result || (!fb.result.sd && !fb.result.hd)) {
      return reply("❌ I couldn't find anything.");
    }

    let caption = `*🖥️ 𝐊ꜱᴍ𝐃 𝐅ᴀᴄᴇʙᴏᴏ𝐊 𝐃𝐋*\n\n📝 TITLE : Facebook Video\n🔗 URL : ${q}`;

    if (fb.result.thumb) {
      await conn.sendMessage(from, {
        image: { url: fb.result.thumb },
        caption: caption,
      }, { quoted: mek });
    }

    // ====== BUTTON MODE ENABLED ======
    if (config.BUTTON === true) {
      let buttons = [];
      if (fb.result.sd) buttons.push({ buttonId: `fb_dl sd ${encodeURIComponent(q)}`, buttonText: { displayText: "📹 Download SD" }, type: 1 });
      if (fb.result.hd) buttons.push({ buttonId: `fb_dl hd ${encodeURIComponent(q)}`, buttonText: { displayText: "🎬 Download HD" }, type: 1 });
      if (fb.result.sd || fb.result.hd) buttons.push({ buttonId: `fb_dl audio ${encodeURIComponent(q)}`, buttonText: { displayText: "🎧 Audio Only" }, type: 1 });

      await conn.sendMessage(from, {
        text: "📥 Select download option:",
        footer: "KSMd FB Downloader",
        buttons: buttons,
        headerType: 4
      }, { quoted: mek });
    } else {
      // ====== FALLBACK: REPLY NUMBERS ======
      let msg = `📥 *Select download option:*\n\n`;
      let i = 1;
      if (fb.result.sd) msg += `*${i++}.* 📹 Download SD\n`;
      if (fb.result.hd) msg += `*${i++}.* 🎬 Download HD\n`;
      msg += `*${i}.* 🎧 Audio Only\n\n_Reply with the number to download._`;

      let sentMsg = await reply(msg);

      // store temporary session
      global.fbDlSessions = global.fbDlSessions || {};
      global.fbDlSessions[sentMsg.key.id] = { url: q, result: fb.result, from };
    }

  } catch (err) {
    console.error(err);
    reply("> *ERROR FB CMD IN KSMD BOT*");
  }
});

// Handle button clicks and reply number selections
cmd({
  pattern: "fb_dl",
  dontAddCommandList: true,
  filename: __filename
}, async (conn, mek, m, { from, args }) => {
  let [quality, ...rest] = args;
  let url = decodeURIComponent(rest.join(" "));

  const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(url)}`);
  if (!fb.result) return reply("❌ File not found.");

  if (quality === "sd" && fb.result.sd) {
    return conn.sendMessage(from, {
      video: { url: fb.result.sd },
      mimetype: "video/mp4",
      caption: `✅ Downloaded as *SD-Quality*`
    }, { quoted: mek });
  }

  if (quality === "hd" && fb.result.hd) {
    return conn.sendMessage(from, {
      video: { url: fb.result.hd },
      mimetype: "video/mp4",
      caption: `✅ Downloaded as *HD-Quality*`
    }, { quoted: mek });
  }

  if (quality === "audio" && (fb.result.sd || fb.result.hd)) {
    let audioUrl = fb.result.hd || fb.result.sd;
    return conn.sendMessage(from, {
      audio: { url: audioUrl },
      mimetype: "audio/mpeg",
      caption: `✅ Downloaded as *Audio Only*`
    }, { quoted: mek });
  }

  reply("❌ Option not available.");
});

// Reply number handler
conn.ev.on("messages.upsert", async ({ messages }) => {
  let msg = messages[0];
  if (!msg.message || !msg.message.conversation) return;
  let body = msg.message.conversation.trim();

  if (global.fbDlSessions && global.fbDlSessions[msg.key.remoteJid]) {
    let sess = global.fbDlSessions[msg.key.remoteJid];
    let choice = parseInt(body);
    let { result } = sess;

    if (choice === 1 && result.sd) {
      await conn.sendMessage(sess.from, { video: { url: result.sd }, mimetype: "video/mp4", caption: `✅ Downloaded as *SD*` }, { quoted: msg });
    } else if ((choice === 2 && result.hd) || (choice === 2 && !result.hd)) {
      await conn.sendMessage(sess.from, { video: { url: result.hd || result.sd }, mimetype: "video/mp4", caption: `✅ Downloaded as *HD*` }, { quoted: msg });
    } else {
      await conn.sendMessage(sess.from, { audio: { url: result.hd || result.sd }, mimetype: "audio/mpeg", caption: `✅ Downloaded as *Audio*` }, { quoted: msg });
    }

    delete global.fbDlSessions[msg.key.remoteJid];
  }
});
