const axios = require("axios");
const { cmd } = require("../command");
const { capturetokenandcookies } = require("../cinesubz"); // Puppeteer function
const { exec } = require("child_process");
const fs = require("fs");

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

        // Request player link
        let dlRes = await axios.post("https://cinesubz.lk/wp-admin/admin-ajax.php", {
            action: "doo_player_ajax",
            token: token
        }, {
            headers: { Cookie: cookies }
        });

        if (!dlRes.data || !dlRes.data.embed_url) return reply("❌ Direct movie link not found!");

        let embed = dlRes.data.embed_url;

        // Googlevideo / m3u8 link capture
        let match = embed.match(/https?:\/\/[^\s"]+/);
        if (!match) return reply("❌ Movie stream link not found!");
        let streamUrl = match[0];

        reply("📥 Downloading movie, please wait...");

        // Temp file save with ffmpeg
        let outPath = `./temp/CineSubz_${Date.now()}.mp4`;
        await new Promise((resolve, reject) => {
            exec(`ffmpeg -i "${streamUrl}" -c copy -bsf:a aac_adtstoasc "${outPath}"`, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });

        let videoBuffer = fs.readFileSync(outPath);
        await conn.sendMessage(from, {
            video: videoBuffer,
            mimetype: "video/mp4",
            fileName: "CineSubZ_Movie.mp4"
        }, { quoted: mek });

        fs.unlinkSync(outPath); // cleanup temp
        reply("✅ Movie sent successfully 🎬");

    } catch (e) {
        console.error(e);
        reply("❌ Error: " + e.message);
    }
});
