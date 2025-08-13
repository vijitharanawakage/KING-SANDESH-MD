const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings"],
    desc: "Show all bot configuration variables (Owner Only)",
    category: "system",
    react: "⚙️",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("🚫 *Owner Only Command!* You're not authorized to view bot configurations.");
        }

        let envSettings = `
╭───『 *${config.BOT_NAME} 𝐂ᴏɴꜰɪ𝐆* 』───❏
│
├─❏ *🤖 🅱🅾🆃 🅸🅽🅵🅾*
│  ├─∘ *𝙽𝙰𝙼𝙴:* ${config.BOT_NAME}
│  ├─∘ *𝙿𝚁𝙴𝙵𝙸𝚇:* ${config.PREFIX}
│  ├─∘ *𝙾𝚆𝙽𝙴𝚁:* ${config.OWNER_NAME}
│  ├─∘ *𝙻𝙾𝙲𝙰𝚃𝙸𝙾𝙽:* ${config.LOCATION}
│  ├─∘ *𝙶𝙸𝚃𝙷𝚄𝙱:* ${config.GITHUB}
│  ├─∘ *𝙴𝙼𝙰𝙸𝙻:* ${config.EMAIL}
│  ├─∘ *𝙾𝚆𝙽𝙴𝚁 𝙽𝚄𝙼𝙱𝙴𝚁:* ${config.OWNER_NUMBER}
│  └─∘ *𝙼𝙾𝙳𝙴:* ${config.MODE.toUpperCase()}
│
├─❏ *⚙️ 🅲🅾🆁🅴 🆂🅴🆃🆃🅸🅽🅶🆂*
│  ├─∘ *𝙿𝚄𝙱𝙻𝙸𝙲 𝙼𝙾𝙳𝙴:* ${isEnabled(config.PUBLIC_MODE) ? "✅" : "❌"}
│  ├─∘ *𝙰𝙻𝚆𝙰𝚈𝚂 𝙾𝙽𝙻𝙸𝙽𝙴:* ${isEnabled(config.ALWAYS_ONLINE) ? "✅" : "❌"}
│  ├─∘ *𝙱𝚄𝚃𝚃𝙾𝙽 𝙼𝙾𝙳𝙴:* ${isEnabled(config.BUTTON) ? "✅" : "❌"}
│  ├─∘ *𝚁𝙴𝙰𝙳 𝙼𝚂𝙶𝚂:* ${isEnabled(config.READ_MESSAGE) ? "✅" : "❌"}
│  └─∘ *𝚁𝙴𝙰𝙳 𝙲𝙼𝙳𝚂:* ${isEnabled(config.READ_CMD) ? "✅" : "❌"}
│
├─❏ *🔌 🅰🆄🆃🅾🅼🅰🆃🅸🅾🅽*
│  ├─∘ *𝙰𝚄𝚃𝙾 𝚁𝙴𝙿𝙻𝚈:* ${isEnabled(config.AUTO_REPLY) ? "✅" : "❌"}
│  ├─∘ *𝙰𝚄𝚃𝙾 𝚅𝙾𝙸𝙲𝙴:* ${isEnabled(config.AUTO_VOICE) ? "✅" : "❌"}
│  ├─∘ *𝙰𝚄𝚃𝙾 𝙽𝙴𝚆𝚂:* ${isEnabled(config.AUTO_NEWS) ? "✅" : "❌"}
│  ├─∘ *𝙰𝚄𝚃𝙾 𝙱𝙸𝙾:* ${isEnabled(config.AUTO_BIO) ? "✅" : "❌"}
│  ├─∘ *𝙰𝚄𝚃𝙾 𝚁𝙴𝙰𝙲𝚃:* ${isEnabled(config.AUTO_REACT) ? "✅" : "❌"}
│  ├─∘ *𝙲𝚄𝚂𝚃𝙾𝙼 𝚁𝙴𝙰𝙲𝚃:* ${isEnabled(config.CUSTOM_REACT) ? "✅" : "❌"}
│  ├─∘ *𝚁𝙴𝙰𝙲𝚃 𝙴𝙼𝙾𝙹𝙸𝚂:* ${config.CUSTOM_REACT_EMOJIS}
│  └─∘ *𝙰𝚄𝚃𝙾 𝚂𝚃𝙸𝙲𝙺𝙴𝚁:* ${isEnabled(config.AUTO_STICKER) ? "✅" : "❌"}
│
├─❏ *📢 🆂🆃🅰🆃🆄🆂 🆂🅴🆃🆃🅸🅽🅶🆂*
│  ├─∘ *𝚂𝚃𝙰𝚃𝚄𝚂 𝚂𝙴𝙴𝙽:* ${isEnabled(config.AUTO_STATUS_SEEN) ? "✅" : "❌"}
│  ├─∘ *𝚂𝚃𝙰𝚃𝚄𝚂 𝚁𝙴𝙿𝙻𝚈:* ${isEnabled(config.AUTO_STATUS_REPLY) ? "✅" : "❌"}
│  ├─∘ *𝚂𝚃𝙰𝚃𝚄𝚂 𝚁𝙴𝙰𝙲𝚃:* ${isEnabled(config.AUTO_STATUS_REACT) ? "✅" : "❌"}
│  └─∘ *𝚂𝚃𝙰𝚃𝚄𝚂 𝙼𝚂𝙶:* ${config.AUTO_STATUS_MSG}
│
├─❏ *🛡️ 🆂🅴🅲🆄🆁🅸🆃🆈*
│  ├─∘ *𝙰𝙽𝚃𝙸-𝙻𝙸𝙽𝙺:* ${isEnabled(config.ANTI_LINK) ? "✅" : "❌"}
│  ├─∘ *𝙰𝙽𝚃𝙸-𝙱𝙰𝙳:* ${isEnabled(config.ANTI_BAD) ? "✅" : "❌"}
│  ├─∘ *𝙰𝙽𝚃𝙸-𝚅𝚅:* ${isEnabled(config.ANTI_VV) ? "✅" : "❌"}
│  └─∘ *𝙳𝙴𝙻 𝙻𝙸𝙽𝙺𝚂:* ${isEnabled(config.DELETE_LINKS) ? "✅" : "❌"}
│
├─❏ *🎨 🅼🅴🅳🅸🅰*
│  ├─∘ *𝙰𝙻𝙸𝚅𝙴 𝙸𝙼𝙶:* ${config.ALIVE_IMG}
│  ├─∘ *𝙼𝙴𝙽𝚄 𝙸𝙼𝙶:* ${config.MENU_IMAGE_URL}
│  ├─∘ *𝙰𝙻𝙸𝚅𝙴 𝙼𝚂𝙶:* ${config.LIVE_MSG}
│  └─∘ *𝚂𝚃𝙸𝙲𝙺𝙴𝚁 𝙿𝙰𝙲𝙺:* ${config.STICKER_NAME}
│
├─❏ *⏳ 🅼🅸🆂🅲*
│  ├─∘ *𝙰𝚄𝚃𝙾 𝚃𝚈𝙿𝙸𝙽𝙶:* ${isEnabled(config.AUTO_TYPING) ? "✅" : "❌"}
│  ├─∘ *𝙰𝚄𝚃𝙾 𝚁𝙴𝙲𝙾𝚁𝙳:* ${isEnabled(config.AUTO_RECORDING) ? "✅" : "❌"}
│  ├─∘ *𝙰𝙽𝚃𝙸-𝙳𝙴𝙻 𝙿𝙰𝚃𝙷:* ${config.ANTI_DEL_PATH}
│  ├─∘ *𝙰𝚄𝚃𝙾 𝙽𝙴𝚆𝚂 𝙽𝚄𝙼𝙱𝙴𝚁:* ${config.AUTO_NEWS_NUMBER}
│  └─∘ *𝙳𝙴𝚅 𝙽𝚄𝙼𝙱𝙴𝚁:* ${config.DEV}
│
╰───『 *${config.FOOTER}* 』───❏
`;

        if (isEnabled(config.BUTTON)) {
            const buttons = [
                {
                    buttonId: ".ok",
                    buttonText: { displayText: "✅ 𝙾𝙺" },
                    type: 1,
                },
                {
                    buttonId: ".setsettings",
                    buttonText: { displayText: "🛠️ 𝚂𝙴𝚃 𝚂𝙴𝚃𝚃𝙸𝙽𝙶𝚂" },
                    type: 1,
                }
            ];

            return await conn.sendMessage(
                from,
                {
                    image: { url: config.MENU_IMAGE_URL },
                    caption: envSettings,
                    buttons: buttons,
                    headerType: 4,
                    contextInfo: {
                        mentionedJid: [m.sender],
                        forwardingScore: 999,
                        isForwarded: true
                    }
                },
                { quoted: mek }
            );
        }

        // If BUTTON mode disabled → fallback normal
        return await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: envSettings,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Error displaying config: ${error.message}`);
    }
});
