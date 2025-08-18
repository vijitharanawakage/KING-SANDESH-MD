const axios = require("axios");
const { cmd, config } = require("../command");

const NEWS_SOURCES = {
    "Gossip Lanka": "https://supun-md-api-rho.vercel.app/api/news/gossiplank",
    "Sirasa News": "https://supun-md-api-rho.vercel.app/api/news/sirasa",
    "Lankadeepa": "https://supun-md-api-rho.vercel.app/api/news/lankadeepa",
    "Ada Derana": "https://supun-md-api-rho.vercel.app/api/news/adaderana"
};

cmd({
    pattern: "snews ?(.*)",
    react: "📰",
    desc: "Get latest news from selected source",
    category: "news",
    use: ".snews",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Check if button mode is enabled
        if (config.BUTTON === 'true') {
            let buttons = Object.keys(NEWS_SOURCES).map(source => ({
                buttonId: `snews_${source.replace(/\s+/g, "")}`,
                buttonText: { displayText: source },
                type: 1
            }));

            await conn.sendMessage(from, {
                text: "📰 Select your news source:",
                buttons: buttons,
                headerType: 1
            }, { quoted: m });
        } else {
            // CLI mode fallback: show sources
            let sourcesList = Object.keys(NEWS_SOURCES).map((s, i) => `${i+1}. ${s}`).join("\n");
            reply(`📰 Select news source by typing: .snews <source>\n\n${sourcesList}`);
        }
    } catch (e) {
        console.error(e);
        reply("❌ Error fetching news sources: " + e.message);
    }
});

// Handling button clicks or CLI selection
cmd({
    pattern: "snews_(.*)",
    react: "📰",
    desc: "Fetch selected news",
    category: "news",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        let sourceKey = args[0];
        let matchedSource = Object.keys(NEWS_SOURCES).find(s => s.replace(/\s+/g, "") === sourceKey);
        if (!matchedSource) return reply("❌ Invalid news source!");

        reply(`⏳ Fetching latest news from ${matchedSource}...`);

        let res = await axios.get(NEWS_SOURCES[matchedSource]);
        if (!res.data || res.data.length === 0) return reply("❌ No news found!");

        // Send top 5 news items
        let newsMsg = res.data.slice(0, 5).map((item, i) => 
            `📰 ${i+1}. ${item.title}\n🔗 ${item.link}`
        ).join("\n\n");

        await conn.sendMessage(from, { text: newsMsg }, { quoted: m });

    } catch (e) {
        console.error(e);
        reply("❌ Error fetching news: " + e.message);
    }
});
