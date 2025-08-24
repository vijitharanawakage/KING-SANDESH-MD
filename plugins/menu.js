const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
  pattern: "menu",
  desc: "Show animated round menu video",
  category: "main",
  react: "🎥",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    // menu.mp4 තියන path එක
    let videoPath = path.join(__dirname, "../assets/menuv.mp4");

    if (!fs.existsSync(videoPath)) {
      return reply("❌ Menu video not found! Please add `menu.mp4` to /media folder.");
    }

    // Round video send
    await conn.sendMessage(m.chat, {
      video: fs.readFileSync(videoPath),
      mimetype: 'video/mp4',
      ptt: true  // <-- මේකයි circle / round video කරන්නෙ
    }, { quoted: mek });

  } catch (e) {
    console.log(e);
    reply("⚠️ Error while sending round menu video!");
  }
});
