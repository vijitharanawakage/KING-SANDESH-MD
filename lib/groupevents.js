//Give Me Credit If Using This File Give Me Credit On Your Channel ✅ 
// All credits goes to bhashana sandesh.

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

// timeout wrapper fix
async function safeGroupMetadata(conn, jid) {
    return new Promise(async (resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Timed Out")), 10000); // 10s
        try {
            const data = await conn.groupMetadata(jid);
            clearTimeout(timeout);
            resolve(data);
        } catch (e) {
            clearTimeout(timeout);
            reject(e);
        }
    });
}

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402220977044@newsletter',
            newsletterName: '<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧',
            serverMessageId: 143,
        },
    };
};

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        // FIX: use safe wrapper instead of direct
        const metadata = await safeGroupMetadata(conn, update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            if (update.action === "add" && config.WELCOME === "true") {
                const WelcomeText = `👋 ＨＥＹ @${userName} \n` +
                    `🙏 𝐖ᴇʟᴄᴏᴍ𝐄 𝐓ᴏ *${metadata.subject}*.\n` +
                    `🔢 🆈ᴏᴜ𝐑 🅼ᴇᴍʙᴇ𝐑 🅽ᴜᴍʙᴇ𝐑 🅸Ｓ ${groupMembersCount} 🅸Ｎ 🆃ʜɪＳ 🅶ʀᴏᴜＰ\n` +
                    `⏰ 𝐓ɪᴍ𝐄 𝐉ᴏɪɴᴇ𝐃: *${timestamp}*\n` +
                    `🫵 𝐏ʟᴇᴀꜱ𝐄 𝐑ᴇᴀ𝐃 𝐓ʜ𝐄 𝐆ʀᴏᴜ𝐏 𝐃ᴇꜱᴄʀɪᴘᴛɪᴏ𝐍 𝐓ᴏ 𝐀ᴠᴏɪ𝐃 𝐁ᴇɪɴ𝐆 𝐑ᴇᴍᴏᴠᴇ𝐃\n` +
                    `${desc}\n` +
                    `> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 ${config.BOT_NAME}*.`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "remove" && config.WELCOME === "true") {
                const GoodbyeText = `😔 ＧＯＯＤ ＢＹＥ @${userName} \n` +
                    `🔙 🅰ɴᴏᴛʜᴇ𝐑 🅼ᴇᴍʙᴇ𝐑 🅷ᴀ𝐒 🅻ᴇꜰ𝐓 🆃ʜＥ 🅶ʀᴏᴜＰ\n` +
                    `⏰ 𝐓ɪᴍ𝐄 𝐋ᴇꜰ𝐓: *${timestamp}*\n` +
                    `😭 𝐓ʜ𝐄 𝐆ʀᴏᴜ𝐏 𝐍ᴏ𝐖 𝐇ᴀ𝐒 ${groupMembersCount} 𝐌ᴇᴍʙᴇʀ𝐒\n` +
                    `> *𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 ${config.BOT_NAME}*.`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });

            } else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `*👤 𝐀ᴅᴍɪ𝐍 𝐄ᴠᴇɴ𝐓*\n\n` +
                          `@${demoter} 𝙷𝙰𝚂 𝙳𝙴𝙼𝙾𝚃𝙴𝙳 @${userName} 𝙵𝚁𝙾𝙼 𝙰𝙳𝙼𝙸𝙽. 𝚂𝙾𝚁𝚁𝚈 👀\n` +
                          `ＴɪᴍＥ: ${timestamp}\n` +
                          `*ＧʀᴏᴜＰ:* ${metadata.subject}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });

            } else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text: `*👤 𝐀ᴅᴍɪ𝐍 𝐄ᴠᴇɴ𝐓*\n\n` +
                          `@${promoter} 𝙷𝙰𝚂 𝙿𝚁𝙾𝙼𝙾𝚃𝙴𝙳 @${userName} 𝚃𝙾 𝙰𝙳𝙼𝙸𝙽 🎉\n` +
                          `ＴɪᴍＥ: ${timestamp}\n` +
                          `*ＧʀᴏᴜＰ:* ${metadata.subject}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }
    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
