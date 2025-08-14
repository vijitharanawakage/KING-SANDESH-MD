const fs = require("fs");
const path = require("path");
const config = require("../config");
const { cmd } = require("../command"); // adjust path if needed

const prefix = config.PREFIX || ".";

cmd({
  pattern: "menu", // .menu
  desc: "Sends the main menu as a video note",
  category: "main",
  react: "🎥",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const videoNotePath = path.join(__dirname, "../assets/menuv.mp4");

    if (fs.existsSync(videoNotePath)) {
      await conn.sendMessage(from, {
        video: fs.readFileSync(videoNotePath),
        mimetype: "video/mp4",
        isRoundVideo: true,
        caption:
          `📍 *_𝐓𝐇𝐀𝐍𝐊 𝐘𝐎𝐔 𝐅𝐎𝐑 𝐔𝐒𝐈𝐍𝐆 <| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧_*\n\n` +
          `> 𝚈𝙾𝚄 𝙲𝙰𝙽 𝚂𝙴𝙴 𝙰𝚅𝙰𝙸𝙻𝙰𝙱𝙻𝙴 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂 𝙱𝙴𝙲𝙰𝚄𝚂𝙴 𝚈𝙾𝚄 𝚂𝙴𝙽𝙳 ${prefix}𝙼𝙴𝙽𝚄 𝙼𝙰𝚂𝚂𝙰𝙶𝙴...☺️!`
      }, { quoted: m });
    } else {
      await reply("❌ `menuv.mp4` file not found in assets folder.");
    }
  } catch (err) {
    console.error("Menu VN Error:", err);
    await reply("⚠️ An error occurred while sending the video note.");
  }
});
