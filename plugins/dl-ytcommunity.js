const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ytpost",
    alias: ["ytcommunity", "ytc"],
    desc: "Download a YouTube community post",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("Please provide a YouTube community post URL.\nExample: `.ytpost <url>`");

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await react("❌");
            return reply("Failed to fetch the community post. Please check the URL.");
        }

        const post = data.data;
        let caption = `📢 *𝐘𝐓 𝐂ᴏᴍᴍᴜɴɪᴛ𝐘 𝐏ᴏꜱ𝐓 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐑* 📢\n\n` +
                      `📜 *𝙲𝙾𝙽𝚃𝙴𝙽𝚃:* ${post.content}`;

        if (post.images && post.images.length > 0) {
            for (const img of post.images) {
                await conn.sendMessage(from, { image: { url: img }, caption }, { quoted: mek });
                caption = "> *© Powered By King-Sandesh-Md V2 💸*"; // Only add caption once, images follow
            }
        } else {
            await conn.sendMessage(from, { text: caption }, { quoted: mek });
        }

        await react("✅");
    } catch (e) {
        console.error("Error in ytpost command:", e);
        await react("❌");
        reply("An error occurred while fetching the YouTube community post.");
    }
});
