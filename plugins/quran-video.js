

import axios from 'axios';
import config from '../../config.cjs';

const quranMedia = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  const videoCommands = ['quranvid', 'qvid', 'quranvideo'];
  const imageCommands = ['quraimage', 'qimg'];

  // ─── 『 Quran Video Command 』 ─── //
  if (videoCommands.includes(cmd)) {
    const videoUrl = 'https://bk9.fun/Islam/quranvid';
    await m.React('🌙');

    await gss.sendMessage(
      m.from,
      {
        video: { url: videoUrl },
        caption:
`┏━━━━━━━━━━━━━━━━━━━┓
┃  *📖 ǫᴜʀᴀɴ ᴠɪᴅᴇᴏ ᴇxᴘᴇʀɪᴇɴᴄᴇ*  
┃━━━━━━━━━━━━━━━━━━━
┃  *“A sound heart starts with divine verses.”*
┃
┃  🌀 *King-Sandesh-Md Exclusive Drop*
┃  🧠 Mind • ✨ Soul • ❤️ Peace
┗━━━━━━━━━━━━━━━━━━━┛`,
      },
      { quoted: m }
    );
  }

  // ─── 『 Quran Image Command 』 ─── //
  if (imageCommands.includes(cmd)) {
    const imageUrl = 'https://bk9.fun/Islam/din';
    await m.React('🕋');

    await gss.sendMessage(
      m.from,
      {
        image: { url: imageUrl },
        caption:
`┏━━━━━━━━━━━━━━━━━━━┓
┃  *🖼️ ǫᴜʀᴀɴ ɪᴍᴀɢᴇ ᴠɪʙᴇ*
┃━━━━━━━━━━━━━━━━━━━
┃  *“Faith isn't seen, it's felt.”*
┃
┃  ⚡ *Coded by Mr Unknown*
┃  ☁️ Reflect • ☀️ Rise • 🕊️ Glow
┗━━━━━━━━━━━━━━━━━━━┛`,
      },
      { quoted: m }
    );
  }
};

export default quranMedia;
