const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
  pattern: 'version',
  alias: ["changelog", "cupdate", "checkupdate"],
  react: '🚀',
  desc: "Check bot's version, system stats, and update info.",
  category: 'info',
  filename: __filename
}, async (conn, mek, m, {
  from, sender, pushname, reply
}) => {
  try {
    // Read local version data
    const localVersionPath = path.join(__dirname, '../data/version.json');
    let localVersion = 'Unknown';
    let changelog = 'No changelog available.';
    if (fs.existsSync(localVersionPath)) {
      const localData = JSON.parse(fs.readFileSync(localVersionPath));
      localVersion = localData.version;
      changelog = localData.changelog;
    }

    // Fetch latest version data from GitHub
    const rawVersionUrl = 'https://raw.githubusercontent.com/vijitharanawakage/KING-SANDESH-MD/main/data/version.json';
    let latestVersion = 'Unknown';
    let latestChangelog = 'No changelog available.';
    try {
      const { data } = await axios.get(rawVersionUrl);
      latestVersion = data.version;
      latestChangelog = data.changelog;
    } catch (error) {
      console.error('Failed to fetch latest version:', error);
    }

    // Count total plugins
    const pluginPath = path.join(__dirname, '../plugins');
    const pluginCount = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length;

    // Count total registered commands
    const totalCommands = commands.length;

    // System info
    const uptime = runtime(process.uptime());
    const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
    const hostName = os.hostname();
    const lastUpdate = fs.statSync(localVersionPath).mtime.toLocaleString();

    // GitHub stats
    const githubRepo = 'https://github.com/vijitharanawakage/KING-SANDESH-MD';

    // Check update status
    let updateMessage = `✅ 𝐘ᴏᴜʀ 𝐊ꜱ-𝐌ᴅ 𝐁ᴏᴛ 𝐈ꜱ 𝐔ᴘ-𝐓ᴏ-𝐃ᴀᴛᴇ!`
    if (localVersion !== latestVersion) {
      updateMessage = `🚀 𝐘ᴏᴜʀ 𝐊ꜱ-𝐌ᴅ 𝐁ᴏᴛ 𝐈ꜱ 𝐎ᴜᴛᴅᴀᴛᴇᴅ!
🔹 *𝙲𝚄𝚁𝚁𝙴𝙽𝚃 𝚅𝙴𝚁𝚂𝙸𝙾𝙽:* ${localVersion}
🔹 *𝙻𝙰𝚃𝙴𝚂𝚃 𝚅𝙴𝚁𝚂𝙸𝙾𝙽:* ${latestVersion}

Use *.update* to update.`;
    }

    const statusMessage = `🌟 *Good ${new Date().getHours() < 12 ? 'Morning' : 'Night'}, ${pushname}!* 🌟\n\n` +
      `📌 *𝙱𝙾𝚃 𝙽𝙰𝙼𝙴:* <| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧\n\n🔖 *𝙲𝚄𝚁𝚁𝙴𝙽𝚃 𝚅𝙴𝚁𝚂𝙸𝙾𝙽:* ${localVersion}\n\n📢 *𝙻𝙰𝚃𝙴𝚂𝚃 𝚅𝙴𝚁𝚂𝙸𝙾𝙽:* ${latestVersion}\n\n📂 *𝚃𝙾𝚃𝙰𝙻 𝙿𝙻𝚄𝙶𝙸𝙽𝚂:* ${pluginCount}\n\n🔢 *𝚃𝙾𝚃𝙰𝙻 𝙲𝙾𝙼𝙼𝙰𝙽𝙳𝚂:* ${totalCommands}\n\n\n\n` +
      `💾 *𝚂𝚈𝚂𝚃𝙴𝙼 𝙸𝙽𝙵𝙾:*\n⏳ *Uptime:* ${uptime}\n📟 *𝚁𝙰𝙼 𝚄𝚂𝙰𝙶𝙴:* ${ramUsage}MB / ${totalRam}MB\n⚙️ *𝙷𝙾𝚂𝚃 𝙽𝙰𝙼𝙴:* ${hostName}\n📅 *𝙻𝙰𝚂𝚃 𝚄𝙿𝙳𝙰𝚃𝙴:* ${lastUpdate}\n\n` +
      `📝 *𝙲𝙷𝙰𝙽𝙶𝙴𝙻𝙾𝙶:*\n${latestChangelog}\n\n` +
      `⭐ *𝙶𝙸𝚃𝙷𝚄𝙱 𝚁𝙴𝙿𝙾:* ${githubRepo}\n👤 *𝙾𝚆𝙽𝙴𝚁:* [Mr.Sandesh Bhashana](wa.me/94741259325)\n\n${updateMessage}\n\n🚀 *Hey! Don't forget to fork & star the repo!*`;

    // Send the status message with an image
    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/3y5w8z.jpg' },
      caption: statusMessage,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363402220977044@newsletter',
          newsletterName: '<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });
  } catch (error) {
    console.error('Error fetching version info:', error);
    reply('❌ An error occurred while checking the bot version.');
  }
});
