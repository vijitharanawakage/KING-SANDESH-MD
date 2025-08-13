const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');

cmd({
  pattern: "ig2",
  alias: ["insta2", "Instagram2"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("❌ Please provide a valid Instagram link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *𝐈ɴꜱᴛᴀɢʀᴀ𝐌 𝐕ɪᴅᴇ𝐎 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐃 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟ𝐘..!*\n\n> *© Powered By King-Sandesh-Md V2 💸*"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});


// twitter-dl

cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return conn.sendMessage(from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await conn.sendMessage(from, {
      react: { text: '⏳', key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `╭━━━〔 *𝐊ꜱᴍ𝐃 𝐓ᴡɪᴛᴛᴇ𝐑 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑* 〕━━━⊷\n`
      + `┃▸ *𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽:* ${desc || "No description"}\n`
      + `╰━━━⪼\n\n`
      + `📹 *𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝙾𝙿𝚃𝙸𝙾𝙽𝚂:*\n`
      + `1️⃣  *𝘚𝘋 𝘘𝘜𝘈𝘓𝘐𝘛𝘠*\n`
      + `2️⃣  *𝘏𝘋 𝘘𝘜𝘈𝘓𝘐𝘛𝘠*\n`
      + `🎵 *𝙰𝚄𝙳𝙸𝙾 𝙾𝙿𝚃𝙸𝙾𝙽𝚂:*\n`
      + `3️⃣  *𝘈𝘜𝘋𝘐𝘖*\n`
      + `4️⃣  *𝘋𝘖𝘊𝘜𝘔𝘌𝘕𝘛*\n`
      + `5️⃣  *𝘝𝘖𝘐𝘊𝘌*\n\n`
      + `📌 *_Reply with the number to download your choice._*`;

    const sentMsg = await conn.sendMessage(from, {
      image: { url: thumb },
      caption: caption
    }, { quoted: m });

    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, {
          react: { text: '⬇️', key: receivedMsg.key }
        });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, {
              video: { url: video_sd },
              caption: "📥 *𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐃 𝐈𝐍 𝐒𝐃 𝐐ᴜᴀʟɪᴛ𝐘*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            await conn.sendMessage(senderID, {
              video: { url: video_hd },
              caption: "📥 *𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐃 𝐈𝐍 𝐇𝐃 𝐐ᴜᴀʟɪᴛ𝐘*"
            }, { quoted: receivedMsg });
            break;

          case "3":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mpeg"
            }, { quoted: receivedMsg });
            break;

          case "4":
            await conn.sendMessage(senderID, {
              document: { url: video_sd },
              mimetype: "audio/mpeg",
              fileName: "Twitter_Audio.mp3",
              caption: "📥 *𝐀ᴜᴅɪ𝐎 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐃 𝐀𝐒 𝐃ᴏᴄᴜᴍᴇɴ𝐓*"
            }, { quoted: receivedMsg });
            break;

          case "5":
            await conn.sendMessage(senderID, {
              audio: { url: video_sd },
              mimetype: "audio/mp4",
              ptt: true
            }, { quoted: receivedMsg });
            break;

          default:
            reply("❌ Invalid option! Please reply with 1, 2, 3, 4, or 5.");
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// MediaFire-dl

cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid MediaFire link.");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await conn.sendMessage(from, {
      react: { text: "⬆️", key: m.key }
    });

    const caption = `╭━━━〔 *𝐊ꜱᴍ𝐃 𝐌ᴇᴅɪᴀꜰɪʀ𝐄 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑* 〕━━━⊷\n`
      + `┃▸ *𝙵𝙸𝙻𝙴 𝙽𝙰𝙼𝙴:* ${file_name}\n`
      + `┃▸ *𝙵𝙸𝙻𝙴 𝚃𝚈𝙿𝙴:* ${mime_type}\n`
      + `╰━━━⪼\n\n`
      + `📥 *_ᴅᴏᴡɴʟᴏᴀᴅɪɴɢ ʏᴏᴜʀ ꜰɪʟᴇ...ᴘʟᴇᴀꜱᴇ ᴡᴀɪᴛ ꜱɪʀ..._*`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption: caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

// apk-dl

cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide an app name to search.");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || !data.datalist || !data.datalist.list.length) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = (app.size / 1048576).toFixed(2); // Convert bytes to MB

    const caption = `╭━━━〔 *𝐊ꜱᴍ𝐃 𝐀ᴘ𝐊 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑* 〕━━━┈⊷
┃ 📦 *𝙽𝙰𝙼𝙴:* ${app.name}
┃ 🏋 *𝚂𝙸𝚉𝙴:* ${appSize} MB
┃ 📦 *𝙿𝙰𝙲𝙺𝙰𝙶𝙴:* ${app.package}
┃ 📅 *𝚄𝙿𝙳𝙰𝚃𝙴𝙳 𝙾𝙽:* ${app.updated}
┃ 👨‍💻 *𝙳𝙴𝚅𝙴𝙻𝙾𝙿𝙴𝚁:* ${app.developer.name}
╰━━━━━━━━━━━━━━━┈⊷
> *© Powered By King-Sandesh-Md V2 💸*`;

    await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption: caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});

// G-Drive-DL

cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  q,
  reply
}) => {
  try {
    if (!q) {
      return reply("❌ Please provide a valid Google Drive link.");
    }

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`;
    const response = await axios.get(apiUrl);
    const downloadUrl = response.data.result.downloadUrl;

    if (downloadUrl) {
      await conn.sendMessage(from, { react: { text: "⬆️", key: m.key } });

      await conn.sendMessage(from, {
        document: { url: downloadUrl },
        mimetype: response.data.result.mimetype,
        fileName: response.data.result.fileName,
        caption: "> *© Powered By King-Sandesh-Md V2 💸*"
      }, { quoted: m });

      await conn.sendMessage(from, { react: { text: "✅", key: m.key } });
    } else {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }
  } catch (error) {
    console.error("Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
}); 
