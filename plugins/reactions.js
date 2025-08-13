const { cmd } = require("../command");
const { fetchGif, gifToVideo } = require("../lib/fetchGif");
const axios = require("axios");

cmd(
    {
        pattern: "cry",
        desc: "Send a crying reaction GIF.",
        category: "fun",
        react: "😢",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙸𝚂 𝙲𝚁𝚈𝙸𝙽𝙶 𝙾𝚅𝙴𝚁 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙲𝚁𝚈𝙸𝙽𝙶 🥺!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/cry";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .cry command:", error);
            reply(`❌ *Error in .cry command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "cuddle",
        desc: "Send a cuddle reaction GIF.",
        category: "fun",
        react: "🤗",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} cuddled @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙲𝚄𝙳𝙳𝙻𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/cuddle";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .cuddle command:", error);
            reply(`❌ *Error in .cuddle command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "bully",
        desc: "Send a bully reaction GIF.",
        category: "fun",
        react: "😈",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙸𝚂 𝙱𝚄𝙻𝙻𝚈𝙸𝙽𝙶 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙱𝚄𝙻𝙻𝚈𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/bully";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .bully command:", error);
            reply(`❌ *Error in .bully command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "hug",
        desc: "Send a hug reaction GIF.",
        category: "fun",
        react: "🤗",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙷𝚄𝙶𝙶𝙴𝙳 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙷𝚄𝙶𝙶𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/hug";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .hug command:", error);
            reply(`❌ *Error in .hug command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);


cmd(
    {
        pattern: "catgirl",
        desc: "Send an catgirl reaction GIF.",
        category: "fun",
        react: "🐺",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙲𝙰𝚃 𝙶𝙸𝚁𝙻𝚂 𝙰𝚃 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙷𝙰𝚂 𝙲𝙰𝚃 𝙶𝙸𝚁𝙻 😹!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/awoo";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .catgirl command:", error);
            reply(`❌ *Error in .catgirl command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "lick",
        desc: "Send a lick reaction GIF.",
        category: "fun",
        react: "👅",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);

            let message = mentionedUser ? `${sender} 𝙻𝙸𝙲𝙺𝙴𝙳 @${mentionedUser.split("@")[0]}` : `${sender} 𝙻𝙸𝙲𝙺𝙴𝙳 𝚃𝙷𝙴𝙼𝚂𝙴𝙻𝚅𝙴𝚂 🥲!`;

            const apiUrl = "https://api.waifu.pics/sfw/lick";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .lick command:", error);
            reply(`❌ *Error in .lick command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);
  
cmd(
    {
        pattern: "pat",
        desc: "Send a pat reaction GIF.",
        category: "fun",
        react: "🫂",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙿𝙰𝚃𝚃𝙴𝙳 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙿𝙰𝚃𝚃𝙴𝙳 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/pat";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .pat command:", error);
            reply(`❌ *Error in .pat command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "smug",
        desc: "Send a smug reaction GIF.",
        category: "fun",
        react: "😏",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙸𝚂 𝚂𝙼𝚄𝙶 𝙰𝚃 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙵𝙴𝙴𝙻𝙸𝙽𝙶 𝚂𝙼𝚄𝙶 😏!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/smug";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .smug command:", error);
            reply(`❌ *Error in .smug command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "bonk",
        desc: "Send a bonk reaction GIF.",
        category: "fun",
        react: "🔨",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙱𝙾𝙽𝙺𝙴𝙳 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙱𝙾𝙽𝙺𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/bonk";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .bonk command:", error);
            reply(`❌ *Error in .bonk command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);


cmd(
    {
        pattern: "yeet",
        desc: "Send a yeet reaction GIF.",
        category: "fun",
        react: "💨",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝚈𝙴𝙴𝚃𝙴𝙳 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝚈𝙴𝙴𝚃𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/yeet";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .yeet command:", error);
            reply(`❌ *Error in .yeet command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "blush",
        desc: "Send a blush reaction GIF.",
        category: "fun",
        react: "😊",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙸𝚂 𝙱𝙻𝚄𝚂𝙷𝙸𝙽𝙶 𝙰𝚃 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙱𝙻𝚄𝚂𝙷𝙸𝙽𝙶 ☺️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/blush";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .blush command:", error);
            reply(`❌ *Error in .blush command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);  
  
cmd(
    {
        pattern: "handhold",
        desc: "Send a hand-holding reaction GIF.",
        category: "fun",
        react: "🤝",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙸𝚂 𝙷𝙰𝙻𝙳𝙸𝙽𝙶 𝙷𝙰𝙽𝙳𝚂 𝚆𝙸𝚃𝙷 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝚆𝙰𝙽𝚃 𝚃𝙾 𝙷𝙾𝙻𝙳 𝙷𝙰𝙽𝙳𝚂 𝚆𝙸𝚃𝙷 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/handhold";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .handhold command:", error);
            reply(`❌ *Error in .handhold command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);


cmd(
    {
        pattern: "highfive",
        desc: "Send a high-five reaction GIF.",
        category: "fun",
        react: "✋",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙶𝙰𝚅𝙴 𝙰 𝙷𝙸𝙶𝙷-𝙵𝙸𝚅𝙴 𝚃𝙾 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙷𝙸𝙶𝙷-𝙵𝙸𝚅𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/highfive";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .highfive command:", error);
            reply(`❌ *Error in .highfive command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);  

cmd(
    {
        pattern: "nom",
        desc: "Send a nom reaction GIF.",
        category: "fun",
        react: "🍽️",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙸𝚂 𝙽𝙾𝙼𝙼𝙸𝙽𝙶 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙽𝙾𝙼𝙼𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/nom";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .nom command:", error);
            reply(`❌ *Error in .nom command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "wave",
        desc: "Send a wave reaction GIF.",
        category: "fun",
        react: "👋",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝚆𝙰𝚅𝙴𝙳 𝙰𝚃 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝚆𝙰𝚅𝙸𝙽𝙶 𝙰𝚃 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/wave";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .wave command:", error);
            reply(`❌ *Error in .wave command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "smile",
        desc: "Send a smile reaction GIF.",
        category: "fun",
        react: "😁",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝚂𝙼𝙸𝙻𝙴𝙳 𝙰𝚃 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝚂𝙼𝙸𝙻𝙻𝙸𝙽𝙶 𝙰𝚃 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/smile";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .smile command:", error);
            reply(`❌ *Error in .smile command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "wink",
        desc: "Send a wink reaction GIF.",
        category: "fun",
        react: "😉",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝚆𝙸𝙽𝙺𝙴𝙳 𝙰𝚃 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝚆𝙸𝙽𝙺𝙸𝙽𝙶 𝙰𝚃 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/wink";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .wink command:", error);
            reply(`❌ *Error in .wink command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "happy",
        desc: "Send a happy reaction GIF.",
        category: "fun",
        react: "😊",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙸𝚂 𝙷𝙰𝙿𝙿𝚈 𝚆𝙸𝚃𝙷 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙷𝙰𝙿𝙿𝚈 𝚆𝙸𝚃𝙷 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/happy";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .happy command:", error);
            reply(`❌ *Error in .happy command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "glomp",
        desc: "Send a glomp reaction GIF.",
        category: "fun",
        react: "🤗",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙶𝙻𝙾𝙼𝙿𝙴𝙳 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙶𝙻𝙾𝙼𝙿𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/glomp";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .glomp command:", error);
            reply(`❌ *Error in .glomp command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "bite",
        desc: "Send a bite reaction GIF.",
        category: "fun",
        react: "🦷",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙱𝙸𝚃𝙴 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙱𝙸𝚃𝙸𝙽𝙶 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️!`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/bite";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .bite command:", error);
            reply(`❌ *Error in .bite command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "poke",
        desc: "Send a poke reaction GIF.",
        category: "fun",
        react: "👉",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙿𝙾𝙺𝙴𝙳 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙿𝙾𝙺𝙴𝙳 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/poke";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .poke command:", error);
            reply(`❌ *Error in .poke command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);
  
  
cmd(
    {
        pattern: "cringe",
        desc: "Send a cringe reaction GIF.",
        category: "fun",
        react: "😬",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝚃𝙷𝙸𝙽𝙺𝚂 @${mentionedUser.split("@")[0]} 𝙸𝚂 𝙲𝚁𝙸𝙽𝙶𝙴`
                : isGroup
                ? `${sender} 𝙵𝙸𝙽𝙳𝚂 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️ cringe`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/cringe";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .cringe command:", error);
            reply(`❌ *Error in .cringe command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);


cmd(
    {
        pattern: "dance",
        desc: "Send a dance reaction GIF.",
        category: "fun",
        react: "💃",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message = mentionedUser
                ? `${sender} 𝙳𝙰𝙽𝙲𝙴𝙳 𝚆𝙸𝚃𝙷 @${mentionedUser.split("@")[0]}`
                : isGroup
                ? `${sender} 𝙸𝚂 𝙳𝙰𝙽𝙲𝙸𝙽𝙶 𝚆𝙸𝚃𝙷 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️`
                : `> *© Powered By King-Sandesh-Md V2 💸*`;

            const apiUrl = "https://api.waifu.pics/sfw/dance";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .dance command:", error);
            reply(`❌ *Error in .dance command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);


  
cmd(
    {
        pattern: "kill",
        desc: "Send a kill reaction GIF.",
        category: "fun",
        react: "🔪",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message;
            if (mentionedUser) {
                let target = `@${mentionedUser.split("@")[0]}`;
                message = `${sender} 𝙺𝙸𝙻𝙻𝙴𝙳 ${target}`;
            } else if (isGroup) {
                message = `${sender} 𝙺𝙸𝙻𝙻𝙴𝙳 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️`;
            } else {
                message = `> *© Powered By King-Sandesh-Md V2 💸*`;
            }

            const apiUrl = "https://api.waifu.pics/sfw/kill";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .kill command:", error);
            reply(`❌ *Error in .kill command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "slap",
        desc: "Send a slap reaction GIF.",
        category: "fun",
        react: "✊",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message;
            if (mentionedUser) {
                let target = `@${mentionedUser.split("@")[0]}`;
                message = `${sender} 𝚂𝙻𝙰𝙿𝙿𝙴𝙳 ${target}`;
            } else if (isGroup) {
                message = `${sender} 𝚂𝙻𝙰𝙿𝙿𝙴𝙳 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️`;
            } else {
                message = `> *© Powered By King-Sandesh-Md V2 💸*`;
            }

            const apiUrl = "https://api.waifu.pics/sfw/slap";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .slap command:", error);
            reply(`❌ *Error in .slap command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);

cmd(
    {
        pattern: "kiss",
        desc: "Send a kiss reaction GIF.",
        category: "fun",
        react: "💋",
        filename: __filename,
        use: "@tag (optional)",
    },
    async (conn, mek, m, { args, q, reply }) => {
        try {
            let sender = `@${mek.sender.split("@")[0]}`;
            let mentionedUser = m.mentionedJid[0] || (mek.quoted && mek.quoted.sender);
            let isGroup = m.isGroup;

            let message;
            if (mentionedUser) {
                let target = `@${mentionedUser.split("@")[0]}`;
                message = `${sender} 𝙺𝙸𝚂𝚂𝙴𝙳 ${target}`;
            } else if (isGroup) {
                message = `${sender} 𝙺𝙸𝚂𝚂𝙴𝙳 𝙴𝚅𝙴𝚁𝚈𝙾𝙽𝙴 🙆‍♂️`;
            } else {
                message = `> *© Powered By King-Sandesh-Md V2 💸*`;
            }

            const apiUrl = "https://api.waifu.pics/sfw/kiss";
            let res = await axios.get(apiUrl);
            let gifUrl = res.data.url;

            let gifBuffer = await fetchGif(gifUrl);
            let videoBuffer = await gifToVideo(gifBuffer);

            await conn.sendMessage(
                mek.chat,
                { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                { quoted: mek }
            );
        } catch (error) {
            console.error("❌ Error in .kiss command:", error);
            reply(`❌ *Error in .kiss command:*\n\`\`\`${error.message}\`\`\``);
        }
    }
);
