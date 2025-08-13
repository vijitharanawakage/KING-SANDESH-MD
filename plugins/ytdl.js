const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "song",
    alias: ["mp3", "ytmp3"],
    react: "🎵",
    desc: "Download Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            const topResults = searchResults.results.slice(0, 5);

            for (const result of topResults) {
                const { videoId, title, image, timestamp, ago, views, author, url } = result;

                let info = `🍄 *𝐊ꜱᴍ𝐃 𝐒ᴏɴ𝐆 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑* 🍄\n\n` +
                    `🎵 *𝚃𝙸𝚃𝙻𝙴:* ${title || "Unknown"}\n` +
                    `⏳ *𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽:* ${timestamp || "Unknown"}\n` +
                    `👀 *𝚅𝙸𝙴𝚆𝚂:* ${views || "Unknown"}\n` +
                    `🌏 *𝚁𝙴𝙻𝙴𝙰𝚂𝙴 𝙰𝙶𝙾:* ${ago || "Unknown"}\n` +
                    `👤 *𝙰𝚄𝚃𝙷𝙾𝚁:* ${author?.name || "Unknown"}\n` +
                    `🖇 *𝚄𝚁𝙻:* ${url || "Unknown"}\n\n`;

                const sentMsg = await conn.sendMessage(from, {
                    image: { url: image },
                    caption: info + (
                        process.env.BUTTON === "true"
                            ? ""
                            : `🔽 *Ｒᴇᴘʟʏ Ｗɪᴛʜ Ｙᴏᴜʀ Ｃʜᴏɪᴄᴇ:*\n1.1 *𝐀𝐔𝐃𝐈𝐎 𝐓𝐘𝐏𝐄* 🎵\n1.2 *𝐃𝐎𝐂𝐔𝐌𝐄𝐍𝐓 𝐓𝐘𝐏𝐄* 📁\n\n${config.FOOTER || "> *© Powered By King-Sandesh Md V2 💸*"}`
                    )
                }, {
                    quoted: mek,
                    ...(process.env.BUTTON === "true" ? {
                        buttons: [
                            { buttonId: `song_aud_${videoId}`, buttonText: { displayText: "🎵 𝐀𝐔𝐃𝐈𝐎 𝐓𝐘𝐏𝐄" }, type: 1 },
                            { buttonId: `song_doc_${videoId}`, buttonText: { displayText: "📁 𝐃𝐎𝐂𝐔𝐌𝐄𝐍𝐓 𝐓𝐘𝐏𝐄" }, type: 1 }
                        ],
                        headerType: 4,
                        footer: "📎 𝐊ꜱᴍ𝐃 𝐒ᴏɴ𝐆 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑"
                    } : {})
                });

                await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

                // Optional delay between each result
                await new Promise(r => setTimeout(r, 1000));
            }

            return;
        }

        // If direct videoId found
        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply("❌ Failed to fetch video!");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        let info = `🍄 *𝐊ꜱᴍ𝐃 𝐒ᴏɴ𝐆 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑* 🍄\n\n` +
            `🎵 *𝚃𝙸𝚃𝙻𝙴:* ${title || "Unknown"}\n` +
            `⏳ *𝙳𝚄𝚁𝙰𝚃𝙸𝙾𝙽:* ${timestamp || "Unknown"}\n` +
            `👀 *𝚅𝙸𝙴𝚆𝚂:* ${views || "Unknown"}\n` +
            `🌏 *𝚁𝙴𝙻𝙴𝙰𝚂𝙴 𝙰𝙶𝙾:* ${ago || "Unknown"}\n` +
            `👤 *𝙰𝚄𝚃𝙷𝙾𝚁:* ${author?.name || "Unknown"}\n` +
            `🖇 *𝚄𝚁𝙻:* ${url || "Unknown"}\n\n`;

        const sentMsg = await conn.sendMessage(from, {
            image: { url: image },
            caption: info + (
                process.env.BUTTON === "true"
                    ? ""
                    : `🔽 *Ｒᴇᴘʟʏ Ｗɪᴛʜ Ｙᴏᴜʀ Ｃʜᴏɪᴄᴇ:*\n1.1 *𝐀𝐔𝐃𝐈𝐎 𝐓𝐘𝐏𝐄* 🎵\n1.2 *𝐃𝐎𝐂𝐔𝐌𝐄𝐍𝐓 𝐓𝐘𝐏𝐄* 📁\n\n${config.FOOTER || "> *© Powered By King-Sandesh Md V2 💸*"}`
            )
        }, {
            quoted: mek,
            ...(process.env.BUTTON === "true" ? {
                buttons: [
                    { buttonId: `song_aud_${id}`, buttonText: { displayText: "🎵 𝐀𝐔𝐃𝐈𝐎 𝐓𝐘𝐏𝐄" }, type: 1 },
                    { buttonId: `song_doc_${id}`, buttonText: { displayText: "📁 𝐃𝐎𝐂𝐔𝐌𝐄𝐍𝐓 𝐓𝐘𝐏𝐄" }, type: 1 }
                ],
                headerType: 4,
                footer: "📎 𝐊ꜱᴍ𝐃 𝐒ᴏɴ𝐆 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑"
            } : {})
        });

        await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

        // Listener same as before (no change needed)
        conn.ev.on('messages.upsert', async (messageUpdate) => {
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message || mekInfo.key.fromMe) return;

                let userReply;
                const isButton = mekInfo?.message?.buttonsResponseMessage;
                const messageType = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
                const repliedMsgID = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId;

                if (process.env.BUTTON === "true") {
                    userReply = mekInfo.message.buttonsResponseMessage?.selectedButtonId;
                    if (!userReply?.startsWith('song_')) return;
                } else {
                    if (repliedMsgID !== sentMsg.key.id) return;
                    userReply = messageType?.trim();
                }

                let msg;
                let type;
                let response;

                const usedId = userReply.split("_")[2] || id;

                if (userReply === "1.1" || userReply === `song_aud_${usedId}`) {
                    msg = await conn.sendMessage(from, { text: "⏳ 𝐏ʀᴏᴄᴇꜱꜱɪɴɢ..." }, { quoted: mek });
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${usedId}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };

                } else if (userReply === "1.2" || userReply === `song_doc_${usedId}`) {
                    msg = await conn.sendMessage(from, { text: "⏳ 𝐏ʀᴏᴄᴇꜱꜱɪɴɢ..." }, { quoted: mek });
                    const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${usedId}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = {
                        document: { url: downloadUrl },
                        fileName: `${title}.mp3`,
                        mimetype: "audio/mpeg",
                        caption: title
                    };

                } else {
                    return await reply("❌ Invalid choice! Reply with 1.1 or 1.2.");
                }

                await conn.sendMessage(from, type, { quoted: mek });
                await conn.sendMessage(from, { text: '✅ 𝐌ᴇᴅɪ𝐀 𝐔ᴘʟᴏᴀᴅᴇ𝐃 𝐒ᴜᴄᴄᴇꜱꜱꜰᴜʟʟ𝐘 ✅', edit: msg.key });

            } catch (error) {
                console.error(error);
                await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});
