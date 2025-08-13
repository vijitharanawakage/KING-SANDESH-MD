const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);
        
        // Style 1: Classic Box
        const style1 = `╭───『 𝐊ꜱᴍ𝐃 𝐔ᴘᴛɪᴍ𝐄 』───⳹
│
│ ⏱️ ${uptime}
│
│ 🚀 𝚂𝚃𝙰𝚁𝚃𝙴𝙳: ${startTime.toLocaleString()}
│
╰────────────────⳹
${config.FOOTER}`;

        // Style 2: Minimalist
        const style2 = `•——[ 𝐊ꜱᴍ𝐃 𝐔ᴘᴛɪᴍ𝐄 ]——•
  │
  ├─ ⏳ ${uptime}
  ├─ 🕒 𝚂𝙸𝙽𝙲𝙴: ${startTime.toLocaleTimeString()}
  │
  •——[ ${config.BOT_NAME} ]——•`;

        // Style 3: Fancy Borders
        const style3 = `▄▀▄▀▄ 𝐊ꜱᴍ𝐃 𝐔ᴘᴛɪᴍ𝐄 ▄▀▄▀▄

  ♢ 𝚁𝚄𝙽𝙽𝙸𝙽𝙶: ${uptime}
  ♢ 𝚂𝙸𝙽𝙲𝙴: ${startTime.toLocaleDateString()}
  
  ${config.FOOTER}`;

        // Style 4: Code Style
        const style4 = `┌──────────────────────┐
│  ⚡ 𝐔ᴘᴛɪᴍ𝐄 𝐒ᴛᴀᴛᴜ𝐒 ⚡  │
├──────────────────────┤
│ • 𝚃𝙸𝙼𝙴: ${uptime}
│ • 𝚂𝚃𝙰𝚁𝚃𝙴𝙳: ${startTime.toLocaleString()}
│ • 𝚅𝙴𝚁𝚂𝙸𝙾𝙽: 2.0.0
└──────────────────────┘`;

        // Style 5: Modern Blocks
        const style5 = `▰▰▰▰▰ 𝐔ᴘᴛɪᴍ𝐄 ▰▰▰▰▰

  ⏳ ${uptime}
  🕰️ ${startTime.toLocaleString()}
  
  ${config.FOOTER}`;

        // Style 6: Retro Terminal
        const style6 = `╔══════════════════════╗
║   ${config.BOT_NAME} 𝐔ᴘᴛɪᴍ𝐄    ║
╠══════════════════════╣
║ > 𝚁𝚄𝙽𝚃𝙸𝙼𝙴: ${uptime}
║ > 𝚂𝙸𝙽𝙲𝙴: ${startTime.toLocaleString()}
╚══════════════════════╝`;

        // Style 7: Elegant
        const style7 = `┌───────────────┐
│  ⏱️  𝐔ᴘᴛɪᴍ𝐄  │
└───────────────┘
│
│ ${uptime}
│
│ 𝚂𝙸𝙽𝙲𝙴 ${startTime.toLocaleDateString()}
│
┌───────────────┐
│  ${config.BOT_NAME}  │
└───────────────┘`;

        // Style 8: Social Media Style
        const style8 = `⏱️ *Uptime Report* ⏱️

🟢 𝙾𝙽𝙻𝙸𝙽𝙴 𝙵𝙾𝚁: ${uptime}
📅 𝚂𝙸𝙽𝙲𝙴: ${startTime.toLocaleString()}

${config.FOOTER}`;

        // Style 9: Fancy List
        const style9 = `╔♫═⏱️═♫══════════╗
   ${config.BOT_NAME} 𝐔ᴘᴛɪᴍ𝐄
╚♫═⏱️═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ ${uptime}
 ✧ 𝚂𝙸𝙽𝙲𝙴 ${startTime.toLocaleDateString()}
•・゜゜・* ✧  *・゜゜・•`;

        // Style 10: Professional
        const style10 = `┏━━━━━━━━━━━━━━━━━━┓
┃  𝐊ꜱᴍ𝐃 𝐔ᴘᴛɪᴍ𝐄 𝐀ɴᴀʟʏꜱɪ𝐒  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈ 𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽: ${uptime}
◈ 𝚂𝚃𝙰𝚁𝚃 𝚃𝙸𝙼𝙴: ${startTime.toLocaleString()}
◈ 𝚂𝚃𝙰𝙱𝙸𝙻𝙸𝚃𝚈: 100%
◈ 𝚅𝙴𝚁𝚂𝙸𝙾𝙽:  2.0.0

${config.FOOTER}`;

        const styles = [style1, style2, style3, style4, style5, style6, style7, style8, style9, style10];
        const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

        await conn.sendMessage(from, { 
            text: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402220977044@newsletter',
                    newsletterName: config.OWNER_NAME || '<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
