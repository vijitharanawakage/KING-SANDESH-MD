import config from '../../config.cjs';

const menu = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "menu") {
    const start = new Date().getTime();
    await m.React('🎀');
    const end = new Date().getTime();
    const responseTime = (end - start) / 1000;

    let profilePictureUrl = 'https://files.catbox.moe/og4tsk.jpg'; // Default image URL
    try {
      const pp = await sock.profilePictureUrl(m.sender, 'image');
      if (pp) {
        profilePictureUrl = pp;
      }
    } catch (error) {
      console.error("Failed to fetch profile picture:", error);
      // Use the default image if fetching fails
    }

    const menuText = `
═══════════════════════
> 🌟  *𝗞𝗜𝗡𝗚-𝗦𝗔𝗡𝗗𝗘𝗦𝗛-𝗠𝗗-𝗩2* 🌟
> *Version*: 2 |
> *DEVELOPED BY SANDESH BHASHANA🪆*
> *ULTRASONIC POWER AND SPEED ⚡
═══════════════════════

_✨ *𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗠𝗘𝗡𝗨* ✨_
> *Explore the commands below to harness the bot's full power!*

═══════════════════════
   🌍  *𝗦𝗬𝗦𝗧𝗘𝗠 𝗠𝗘𝗡𝗨* 🌍
═══════════════════════
| ⚡ | ${prefix}menu
| 🟢 | ${prefix}alive
| 🛠️ | ${prefix}owner
| 🍔 | ${prefix}list
═══════════════════════

═══════════════════════
   👑  *𝗢𝗪𝗡𝗘𝗥 𝗠𝗘𝗡𝗨* 👑
═══════════════════════
| 🎮 | ${prefix}join
| 🚪 | ${prefix}leave
| 🩷 | ${prefix}autobio
| 🔒 | ${prefix}block
| 🧋 | ${prefix}autolikestatus
| 🔓 | ${prefix}unblock
| 🤖 | ${prefix}antidelete on
| 🚫 | ${prefix}anticall
| 🛑 | ${prefix}settings
| 📝 | ${prefix}setname
═══════════════════════

═══════════════════════
  🤖  *𝗚𝗣𝗧 𝗠𝗘𝗡𝗨* 🤖
═══════════════════════
| 💬 | ${prefix}ai
| 🐞 | ${prefix}bug
| 📝 | ${prefix}report
| 🚪 | ${prefix}chatbot
| 🧠 | ${prefix}gpt
| 🎨 | ${prefix}xeon
═══════════════════════

═══════════════════════
  📦  *𝗖𝗢𝗡𝗩𝗘𝗥𝗧𝗘𝗥 𝗣𝗔𝗚𝗘* 📦
═══════════════════════
| 🎶 | ${prefix}attp
| 🎬 | ${prefix}gimage
| 🎧 | ${prefix}play
| 📹 | ${prefix}video
═══════════════════════

═══════════════════════
   🔍  *𝗦𝗘𝗔𝗥𝗖𝗛 𝗠𝗘𝗡𝗨* 🔍
═══════════════════════
| 🔎 | ${prefix}google
| 📽️ | ${prefix}mediafire
| 🚪 | ${prefix}facebook
| ❤️ | ${prefix}instagram
| 🚪 | ${prefix}tiktok
| 🎶 | ${prefix}lyrics
| 🎬 | ${prefix}imdb
| 🔞 | ${prefix}hwaifu/sex/xxx
═══════════════════════

═══════════════════════
   🔍  *𝗙𝗨𝗡 𝗠𝗘𝗡𝗨* 🔍
═══════════════════════
| 🔎 | ${prefix}getpp
| 📽️ | ${prefix}url
| 😂 | ${prefix}roast
═══════════════════════


🔧 *Wᴇʟᴄᴏᴍᴇ ᴛᴏ ᴛʜᴇ ᴍᴇɴᴜ!*
*ᴡᴀɪᴛ ғᴏʀ ᴍᴏʀᴇ ᴄᴏᴍᴍᴀɴᴅs...*

📢 *ᴅᴇᴠᴇʟᴏᴘᴇʀ ꜱᴀɴᴅᴇꜱʜ ʙʜᴀꜱʜᴀɴᴀ*

`;

    await sock.sendMessage(m.from, {
      image: { url: profilePictureUrl },
      caption: menuText.trim(),
      contextInfo: {
        forwardingScore: 5,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterName: "<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧",
          newsletterJid: "120363402220977044@newsletter",
        },
      }
    }, { quoted: m });
  }
};

export default menu;
