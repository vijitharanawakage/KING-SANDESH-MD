const axios = require("axios");
const { cmd } = require("../command");
const { capturetokenandcookies } = require("../cinesubz"); // Puppeteer function

cmd({
    pattern: "cinesubz ?(.*)",
    react: "🎬",
    desc: "Direct download from CineSubZ",
    category: "movie",
    use: ".cinesubz <movie-page-url>",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        if (!args[0]) return reply("❌ Please provide CineSubZ movie page link!");

        let url = args[0];
        reply("⏳ Capturing token & cookies from CineSubZ...");

        // Puppeteer scrape
        let { token, cookies } = await capturetokenandcookies(url);
        if (!token || !cookies) return reply("❌ Failed to capture CineSubZ token/cookies.");

        reply("✅ Token & Cookies captured. Fetching movie...");

        // Request movie file link
        let dlRes = await axios.post("https://cinesubz.lk/wp-admin/admin-ajax.php", {
            action: "doo_player_ajax",
            token: token
        }, {
            headers: { Cookie: cookies }
        });

        if (!dlRes.data || !dlRes.data.embed_url) return reply("❌ Direct movie link not found!");

        let fileUrl = dlRes.data.embed_url;

        // Download buffer
        let fileRes = await axios.get(fileUrl, { responseType: "arraybuffer" });

        await conn.sendMessage(from, { 
            video: fileRes.data, 
            mimetype: "video/mp4", 
            fileName: "CineSubZ_Movie.mp4" 
        }, { quoted: mek });

        reply("✅ Movie sent successfully 🎬");

    } catch (e) {
        console.error(e);
        reply("❌ Error: " + e.message);
    }
});
