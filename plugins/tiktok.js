import config from '../../config.cjs';
import axios from 'axios';

const tiktokdl = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const q = m.body.split(' ').slice(1).join(' ');
  const reply = (text) => sock.sendMessage(m.from, { text }, { quoted: m });

  if (cmd === "tiktokdl" || cmd === "tiktok") {
    if (!q) return reply(`✨ ʏᴏᴜ sʜᴏᴜʟᴅ ᴘʀᴏᴠɪᴅᴇ ᴀ ᴛɪᴋᴛᴏᴋ ʟɪɴᴋ. Example: ${prefix}${cmd} https://vm.tiktok.com/xxxx/ ✨`);
    if (!q.includes("tiktok.com")) return reply("⚠️ That doesn't look like a valid TikTok link.");

    await reply("🚀 Initializing download... Please be patient! ⏳");

    try {
      const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
      const { data } = await axios.get(apiUrl);

      if (!data.status || !data.data) return reply("💔 Failed to fetch TikTok video. The server might be down or the link is invalid.");

      const { title, like, comment, share, author, meta } = data.data;
      const videoUrl = meta.media.find(v => v.type === "video")?.org;
      const views = meta?.play_count || 'N/A'; // Attempt to get view count

      if (!videoUrl) return reply("⚠️ Could not retrieve the video URL from the response.");

      const caption = `🎬 *TikTok Video Downloaded!* 🎬\n\n` +
                      `👤 *Creator:* ${author.nickname} (@${author.username})\n` +
                      `📝 *Title:* ${title || 'No title available'}\n` +
                      `👁️ *Views:* ${views}\n` +
                      `❤️ *Likes:* ${like}\n` +
                      `💬 *Comments:* ${comment}\n` +
                      `🔗 *Share:* ${share}\n\n` +
                      `> 🌐 ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴋɪɴɢ-ꜱᴀɴᴅᴇꜱʜ-ᴍᴅ ᴛɪᴋ ᴛᴏᴋ ᴅᴏᴡɴʟᴏᴀᴅᴇʀ..!`;

      await sock.sendMessage(m.from, {
        video: { url: videoUrl },
        caption: caption,
        contextInfo: { mentionedJid: [m.sender] }
      }, { quoted: m });

    } catch (e) {
      console.error("🔥 Error during TikTok download:", e);
      reply(`🚨 An error occurred: ${e.message} 🚨`);
    }
  }
};

export default tiktokdl;
