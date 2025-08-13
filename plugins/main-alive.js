const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check bot is alive or not",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const status = `
╭───〔 *🤖 ${config.BOT_NAME} 𝐒ᴛᴀᴛᴜ𝐒* 〕───◉
│✨ *𝙱𝙾𝚃 𝙸𝚂 𝙰𝙲𝚃𝙸𝚅𝙴 & 𝙾𝙽𝙻𝙸𝙽𝙴..!*
│
│🧠 *ＯＷＮＥＲ:* ${config.OWNER_NAME}
│⚡ *ＶＥＲＳＩＯＮ:* 2.0.0
│📝 *ＰＲＥＦＩＸ:* [${config.PREFIX}]
│📳 *ＭＯＤＥ:* [${config.MODE}]
│💾 *ＲＡＭ:* ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${(os.totalmem() / 1024 / 1024).toFixed(2)}MB
│🖥️ *ＨＯＳＴ:* ${os.hostname()}
│⌛ *ＵＰＴＩＭＥ:* ${runtime(process.uptime())}
╰───────────────────────────────────◉
> ${config.FOOTER}`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL },
            caption: status,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 1000,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402220977044@newsletter',
                    newsletterName: '<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        reply(`An error occurred: ${e.message}`);
    }
});
