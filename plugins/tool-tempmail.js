const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "tempmail",
    alias: ["genmail"],
    desc: "Generate a new temporary email address",
    category: "utility",
    react: "📧",
    filename: __filename
},
async (conn, mek, m, { from, reply, prefix }) => {
    try {
        const response = await axios.get('https://apis.davidcyriltech.my.id/temp-mail');
        const { email, session_id, expires_at } = response.data;

        // Format the expiration time and date
        const expiresDate = new Date(expires_at);
        const timeString = expiresDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const dateString = expiresDate.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });

        // Create the complete message
        const message = `
📧 *𝐓ᴇᴍᴘᴏʀᴀʀ𝐘 𝐄ᴍᴀɪ𝐋 𝐆ᴇɴᴇʀᴀᴛᴇ𝐃*

✉️ *𝙴𝙼𝙰𝙸𝙻 𝙰𝙳𝙳𝚁𝙴𝚂𝚂:*
${email}

⏳ *𝙴𝚇𝙿𝙸𝚁𝙴𝚂:*
${timeString} • ${dateString}

🔑 *𝚂𝙴𝚂𝚂𝙸𝙾𝙽 𝙸𝙳:*
\`\`\`${session_id}\`\`\`

📥 *𝙲𝙷𝙴𝙲𝙺 𝙸𝙽𝙱𝙾𝚇:*
.inbox ${session_id}

_*~Email will expire after 24 hours~*_
`;

        await conn.sendMessage(
            from,
            { 
                text: message,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363402220977044@newsletter',
                        newsletterName: '<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧',
                        serverMessageId: 101
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('TempMail error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});
cmd({
    pattern: "checkmail",
    alias: ["inbox", "tmail", "mailinbox"],
    desc: "Check your temporary email inbox",
    category: "utility",
    react: "📬",
    filename: __filename
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const sessionId = args[0];
        if (!sessionId) return reply('🔑 Please provide your session ID\nExample: .checkmail YOUR_SESSION_ID');

        const inboxUrl = `https://apis.davidcyriltech.my.id/temp-mail/inbox?id=${encodeURIComponent(sessionId)}`;
        const response = await axios.get(inboxUrl);

        if (!response.data.success) {
            return reply('❌ Invalid session ID or expired email');
        }

        const { inbox_count, messages } = response.data;

        if (inbox_count === 0) {
            return reply('📭 𝐘ᴏᴜʀ 𝐈ɴʙᴏx 𝐈ꜱ 𝐄ᴍᴘᴛʏ');
        }

        let messageList = `📬 *𝐘ᴏᴜ 𝐇ᴀᴠᴇ ${inbox_count} 𝐌ᴇꜱꜱᴀɢᴇ(ꜱ)*\n\n`;
        messages.forEach((msg, index) => {
            messageList += `━━━━━━━━━━━━━━━━━━\n` +
                          `📌 *𝙼𝙴𝚂𝚂𝙰𝙶𝙴 ${index + 1}*\n` +
                          `👤 *𝙵𝚁𝙾𝙼:* ${msg.from}\n` +
                          `📝 *𝚂𝚄𝙱𝙹𝙴𝙲𝚃:* ${msg.subject}\n` +
                          `⏰ *𝙳𝙰𝚃𝙴:* ${new Date(msg.date).toLocaleString()}\n\n` +
                          `📄 *𝙲𝙾𝙽𝚃𝙴𝙽𝚃:*\n${msg.body}\n\n`;
        });

        await reply(messageList);

    } catch (e) {
        console.error('CheckMail error:', e);
        reply(`❌ Error checking inbox: ${e.response?.data?.message || e.message}`);
    }
});
