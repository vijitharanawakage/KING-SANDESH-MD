const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "ping2",
    alias: ["speed","pong"],
    use: '.ping',
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = new Date().getTime();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Ensure reaction and text emojis are different
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // Send reaction using conn.sendMessage()
        await conn.sendMessage(from, {
            react: { text: textEmoji, key: mek.key }
        });

        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;

        const text = `> *📍 𝐊ꜱᴍ𝐃 𝐏ɪɴ𝐆: ${responseTime.toFixed(2)}𝐌𝐒 ${reactionEmoji}*`;

        await conn.sendMessage(from, {
            text,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402220977044@newsletter',
                    newsletterName: "<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in ping command:", e);
        reply(`An error occurred: ${e.message}`);
    }
});

// ping2 

cmd({
    pattern: "ping",
    desc: "Check bot's response time.",
    category: "main",
    react: "🍂",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        const startTime = Date.now();
        const { key } = await conn.sendMessage(from, { text: '*𝙿𝙸𝙽𝙶𝙸𝙽𝙶 𝙺𝚂𝙼𝙳...*' });
        const endTime = Date.now();
        const ping = endTime - startTime;
    
        const loadingStages = [
            'ʟᴏᴀᴅɪɴɢ 《 ▭▭▭▭▭▭▭▭▭▭ 》0%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▭▭▭▭▭▭▭▭▭ 》10%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▭▭▭▭▭▭▭▭ 》20%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▭▭▭▭▭▭▭ 》30%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▭▭▭▭▭▭ 》40%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▭▭▭▭▭ 》50%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▭▭▭▭ 》60%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▬▭▭▭ 》70%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▬▬▭▭ 》80%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▬▬▬▭ 》90%,',
            'ʟᴏᴀᴅɪɴɢ 《 ▬▬▬▬▬▬▬▬▬▬ 》100%,',
            `𝐑𝐞𝐬𝐩𝐨𝐧𝐬𝐞 𝐒𝐩𝐞𝐞𝐝 ${ping} 𝐦𝐬`,
        ];
    
        for (let i = 0; i < loadingStages.length; i++) {
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: key,
                        type: 14,
                        editedMessage: {
                            conversation: loadingStages[i],
                        },
                    },
                },
                {}
            );
        }
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
})
