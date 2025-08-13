const { cmd } = require("../command");
const nima = require('mrnima-moviedl');

cmd({
  pattern: 'moviedl',
  desc: 'Search & Download movies (button/CLI)',
  category: 'download',
  filename: __filename
}, async (conn, m, { args }) => {
  if (!args[0]) return m.reply('🎬 *Please enter a movie name.*');

  const query = args.join(' ');
  const movieName = args.slice(0, -1).join(' ') || args[0];
  const quality = args[args.length - 1].toLowerCase().includes('p') ? args[args.length - 1] : null;

  let res = await nima(movieName).catch(() => null);
  if (!res || res.length === 0) return m.reply('❌ *Movie not found!*');

  const movie = res[0];
  const { title, year, poster, download_links } = movie;

  // CLI command with quality: .moviedl KGF 720p
  if (quality && download_links[quality]) {
    return await m.reply(`📥 *𝐃ᴏᴡɴʟᴏᴀ𝐃 𝐋ɪɴ𝐊 𝐅ᴏ𝐑 ${title} (${quality}):*\n${download_links[quality]}`);
  }

  // Button response
  const buttons = Object.keys(download_links).map(q => ({
    buttonId: `.moviedl ${movieName} ${q}`,
    buttonText: { displayText: `🎥 ${q}` },
    type: 1
  }));

  await conn.sendMessage(m.from, {
    image: { url: poster },
    caption: `🎬 *${title}*\n🗓️ 𝚈𝙴𝙰𝚁: ${year}\n\n📥 *Ｓᴇʟᴇᴄᴛ Ｑᴜᴀʟɪᴛʏ Ｏʀ Ｕꜱᴇ :*\n.moviedl ${movieName} 720p`,
    footer: '<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧 𝐌ᴏᴠɪᴇ 𝐃ᴏᴡɴʟᴏᴀᴅᴇʀ',
    buttons,
    headerType: 4
  }, { quoted: m });
});

cmd({
  pattern: 'tvshowdl',
  desc: 'Search & Download TV shows (button/CLI)',
  category: 'download',
  filename: __filename
}, async (conn, m, { args }) => {
  if (!args[0]) return m.reply('📺 *Please enter a TV show name.*');

  const query = args.join(' ');
  const showName = args.slice(0, -1).join(' ') || args[0];
  const quality = args[args.length - 1].toLowerCase().includes('p') ? args[args.length - 1] : null;

  let res = await nima(showName).catch(() => null);
  if (!res || res.length === 0) return m.reply('❌ *TV show not found!*');

  const show = res[0];
  const { title, year, poster, download_links } = show;

  // CLI command with quality: .tvshowdl Friends 720p
  if (quality && download_links[quality]) {
    return await m.reply(`📥 *𝐃ᴏᴡɴʟᴏᴀ𝐃 𝐋ɪɴ𝐊 𝐅ᴏ𝐑 ${title} (${quality}):*\n${download_links[quality]}`);
  }

  // Button response
  const buttons = Object.keys(download_links).map(q => ({
    buttonId: `.tvshowdl ${showName} ${q}`,
    buttonText: { displayText: `📺 ${q}` },
    type: 1
  }));

  await conn.sendMessage(m.from, {
    image: { url: poster },
    caption: `📺 *${title}*\n🗓️ 𝚈𝙴𝙰𝚁: ${year}\n\n📥 *Ｓᴇʟᴇᴄᴛ Ｑᴜᴀʟɪᴛʏ Ｏʀ Ｕꜱᴇ :*\n.tvshowdl ${showName} 720p`,
    footer: '<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧 𝐓ᴠ 𝐒ᴇʀɪᴇꜱ 𝐃ᴏᴡɴʟᴏᴀᴅᴇʀ',
    buttons,
    headerType: 4
  }, { quoted: m });
});
