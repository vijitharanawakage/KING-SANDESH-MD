// ⿻ ⌜𝐌𝐑𝐔𝐍𝐊𝐍𝐎𝐖𝐍 𝐗 𝐆𝐑𝐀𝐘 𝐖𝐎𝐋𝐅

const { cmd } = require("../command");
const TorrentSearchApi = require('torrent-search-api');
const WebTorrent = require('webtorrent');
const fs = require('fs');
const path = require('path');
const config = require('../config');

TorrentSearchApi.enablePublicProviders();
const client = new WebTorrent();

let sessionTorrents = {}; // simple in-memory session store keyed by user/chat id

// Convert config.BUTTON to real boolean
const isButtonEnabled = config.BUTTON === true || config.BUTTON === 'true';

cmd({
  pattern: 'torrentdl',
  desc: 'Search and download movie torrents',
  category: 'download',
  react: "🔍",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  if (!args[0]) return reply('🔎 Please enter a movie or show name to search.');

  const query = args.join(' ');

  try {
    const torrents = await TorrentSearchApi.search(query, 'Movies', 5);
    if (!torrents.length) return reply('❌ No torrents found for that query.');

    sessionTorrents[from] = torrents;

    if (isButtonEnabled) {
      const buttons = torrents.map((t, i) => ({
        buttonId: `.gettorrent ${i}`,
        buttonText: { displayText: `${t.title} (${t.size}, 𝐒ᴇᴇᴅꜱ: ${t.seeds})` },
        type: 1
      }));

      await conn.sendMessage(from, {
        text: `*🎬 ＲᴇꜱᴜʟᴛＳ ＦᴏＲ* *${query}*\n*ＳᴇʟᴇᴄＴ ＯɴＥ ＴᴏʀʀᴇɴＴ ＴＯ ＤᴏᴡɴʟᴏᴀＤ:*`,
        buttons,
        footer: '> *© Powered By King-Sandesh-Md V2 💸*',
        headerType: 1
      }, { quoted: mek });
    } else {
      let listText = `*🎬 ＲᴇꜱᴜʟᴛＳ ＦᴏＲ* *${query}*\n\n`;
      torrents.forEach((t, i) => {
        listText += `${i + 1}. ${t.title} (${t.size}, 𝐒ᴇᴇᴅꜱ: ${t.seeds})\n`;
      });
      listText += `\n👉 𝚁𝙴𝙿𝙻𝚈 𝚆𝙸𝚃𝙷 *.gettorrent <number>* 𝚃𝙾 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳.`;
      reply(listText);
    }
  } catch (e) {
    console.error(e);
    reply('❌ Error searching torrents.');
  }
});


cmd({
  pattern: 'gettorrent',
  desc: 'Download selected torrent',
  category: 'download',
  react: "⏳",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  const torrents = sessionTorrents[from];
  if (!torrents) return reply('❌ No torrent search session found. Please use .torrentdl first.');

  const index = parseInt(args[0]);
  if (isNaN(index) || index < 0 || index >= torrents.length)
    return reply('❌ Invalid selection.');

  const torrent = torrents[index];

  let magnet = torrent.magnet;
  if (!magnet) {
    try {
      magnet = await TorrentSearchApi.getMagnet(torrent);
    } catch (e) {
      return reply('❌ Failed to get magnet link.');
    }
  }

  reply(`⏳ 𝐒ᴛᴀʀᴛɪɴɢ 𝐃ᴏᴡɴʟᴏᴀᴅ 𝐅ᴏʀ :\n${torrent.title}\n📎 𝐒ɪᴢᴇ : ${torrent.size}\n🍒 𝐒ᴇᴇᴅꜱ : ${torrent.seeds}`);

  const torrentPath = path.join(__dirname, '../tmp', `${Date.now()}-${torrent.title.replace(/[^\w\s]/gi, '')}`);

  if (!fs.existsSync(torrentPath)) fs.mkdirSync(torrentPath, { recursive: true });

  const torrentClient = client.add(magnet, { path: torrentPath });

  torrentClient.on('error', err => {
    reply('❌ Torrent download error: ' + err.message);
  });

  torrentClient.on('done', async () => {
    const file = torrentClient.files.reduce((a, b) => (a.length > b.length ? a : b));
    const filePath = path.join(torrentPath, file.name);

    try {
      await conn.sendMessage(from, {
        video: { url: filePath },
        caption: `🎬 ${torrent.title}\n🗓️ 𝐒ɪᴢ𝐄: ${torrent.size}\n🌱 𝐒ᴇᴇᴅ𝐒: ${torrent.seeds}\n\n𝐇ᴇʀ𝐄 𝐈𝐒 𝐘ᴏᴜ𝐑 𝐓ᴏʀʀᴇɴ𝐓 𝐃ᴏᴡɴʟᴏᴀ𝐃.`
        // Removed mimetype so that .mkv, .webm etc work correctly
      }, { quoted: mek });

      torrentClient.destroy();
      fs.rmSync(torrentPath, { recursive: true, force: true });
    } catch (e) {
      reply('❌ Failed to send video: ' + e.message);
    }
  });
});
