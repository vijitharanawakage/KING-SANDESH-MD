const { cmd } = require("../command");
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const AdmZip = require("adm-zip");
const { setCommitHash, getCommitHash } = require('../data/updateDB');

cmd({
    pattern: "update",
    alias: ["upgrade", "sync"],
    react: '🆕',
    desc: "Update the bot to the latest version.",
    category: "misc",
    filename: __filename
}, async (client, message, args, { reply, isOwner }) => {
    if (!isOwner) return reply("This command is only for the bot owner.");

    try {
        await reply("🔍 𝐂ʜᴇᴄᴋɪɴ𝐆 𝐅ᴏ𝐑 𝐊ꜱᴍ𝐃 𝐔ᴘᴅᴀᴛᴇ𝐒...");

        // Fetch the latest commit hash from GitHub
        const { data: commitData } = await axios.get("https://api.github.com/repos/vijitharanawakage/KING-SANDESH-MD/commits/V-2");
        const latestCommitHash = commitData.sha;

        // Get the stored commit hash from the database
        const currentHash = await getCommitHash();

        if (latestCommitHash === currentHash) {
            return reply("✅ 𝐘ᴏᴜʀ 𝐊ꜱᴍᴅ 𝐁ᴏᴛ 𝐈ꜱ 𝐀ʟʀᴇᴀᴅʏ 𝐔ᴘ-𝐓ᴏ-𝐃ᴀᴛᴇ..!");
        }

        await reply("🚀 𝚄𝙿𝙳𝙰𝚃𝙸𝙽𝙶 <| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧...");

        // Download the latest code
        const zipPath = path.join(__dirname, "latest.zip");
        const { data: zipData } = await axios.get("https://github.com/vijitharanawakage/KING-SANDESH-MD/archive/V-2.zip", { responseType: "arraybuffer" });
        fs.writeFileSync(zipPath, zipData);

        // Extract ZIP file
        await reply("📦 Ｅxᴛʀᴀᴄᴛɪɴɢ Ｔʜᴇ Ｌᴀᴛᴇꜱᴛ Ｃᴏᴅᴇ...");
        const extractPath = path.join(__dirname, 'latest');
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(extractPath, true);

        // Copy updated files, preserving config.js and app.json
        await reply("🔄 𝚁𝙴𝙿𝙻𝙰𝙲𝙸𝙽𝙶 𝙵𝙸𝙻𝙴𝚂...");
        const sourcePath = path.join(extractPath, "KING-SANDESH-MD-V-2");
        const destinationPath = path.join(__dirname, '..');
        copyFolderSync(sourcePath, destinationPath);

        // Save the latest commit hash to the database
        await setCommitHash(latestCommitHash);

        // Cleanup
        fs.unlinkSync(zipPath);
        fs.rmSync(extractPath, { recursive: true, force: true });

        await reply("✅ 𝚄𝙿𝙳𝙰𝚃𝙴 𝙲𝙾𝙼𝙿𝙻𝙴𝚃𝙴..! 𝚁𝙴𝚂𝚃𝙰𝚁𝚃𝙸𝙽𝙶 𝚃𝙷𝙴 𝙺𝚂𝙼𝙳 𝙱𝙾𝚃...");
        process.exit(0);
    } catch (error) {
        console.error("Update error:", error);
        return reply("❌ Update failed. Please try manually.");
    }
});

// Helper function to copy directories while preserving config.js and app.json
function copyFolderSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    const items = fs.readdirSync(source);
    for (const item of items) {
        const srcPath = path.join(source, item);
        const destPath = path.join(target, item);

        // Skip config.js and app.json
        if (item === "config.js" || item === "app.json") {
            console.log(`Skipping ${item} to preserve custom settings.`);
            continue;
        }

        if (fs.lstatSync(srcPath).isDirectory()) {
            copyFolderSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}
