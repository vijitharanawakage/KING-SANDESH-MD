const axios = require("axios");
const cheerio = require("cheerio");
const { cmd } = require("../command");
const { DownloaderHelper } = require('nodejs-file-downloader');
const fs = require("fs");
const path = require("path");

const BUTTON_MODE = process.env.BUTTON === "true"; // config.js BUTTON flag

// Levenshtein distance function for closest match
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) matrix[i][j] = matrix[i - 1][j - 1];
      else matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

// Search movies on cinesubz.lk
async function searchMovies(query) {
  try {
    const url = `https://cinesubz.lk/?s=${encodeURIComponent(query)}`;
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const movies = [];
    $('.item-thumb').each((i, el) => {
      const title = $(el).find('.post-title').text().trim();
      const link = $(el).find('a').attr('href');
      if (title && link) movies.push({ title, link });
    });

    if (!movies.length) return null;

    // Find closest title
    let closest = movies[0];
    let minDist = levenshteinDistance(query.toLowerCase(), closest.title.toLowerCase());

    for (const movie of movies) {
      const dist = levenshteinDistance(query.toLowerCase(), movie.title.toLowerCase());
      if (dist < minDist) {
        minDist = dist;
        closest = movie;
      }
    }
    return closest;
  } catch (e) {
    return null;
  }
}

// Get download qualities & links from movie page
async function getQualities(movieUrl) {
  try {
    const { data } = await axios.get(movieUrl);
    const $ = cheerio.load(data);

    const qualities = [];

    $('.btn-download').each((i, el) => {
      const qualityText = $(el).text().trim(); // e.g. "1080p"
      const downloadLink = $(el).attr('href');
      if (qualityText && downloadLink) qualities.push({ quality: qualityText, link: downloadLink });
    });

    return qualities;
  } catch (e) {
    return [];
  }
}

cmd({
  pattern: "cinesubz",
  desc: "Download movies from cinesubz.lk",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide a movie name to search.");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const movie = await searchMovies(q);
    if (!movie) return reply("⚠️ Movie not found on cinesubz.lk");

    const qualities = await getQualities(movie.link);
    if (!qualities.length) return reply("⚠️ No download qualities found for this movie.");

    global.cinesubz_sessions = global.cinesubz_sessions || {};
    global.cinesubz_sessions[m.sender] = { qualities, movieTitle: movie.title };

    if (BUTTON_MODE) {
      // Button mode
      const buttons = qualities.map((q, i) => ({
        buttonId: `cinesubz_dl_${i}`,
        buttonText: { displayText: q.quality },
        type: 1
      }));

      await conn.sendMessage(from, {
        text: `🎬 Ｓᴇʟᴇᴄᴛ Ｄᴏᴡɴʟᴏᴀᴅ Ｑᴜᴀʟɪᴛʏ Ｆᴏʀ *${movie.title}*:\n\n`,
        footer: "Powered by King-Sandesh-Md V2 💸",
        buttons,
        headerType: 1
      });

    } else {
      // CLI reply mode - list qualities as numbered list and ask reply with number
      let messageText = `🎬 Ｓᴇʟᴇᴄᴛ Ｄᴏᴡɴʟᴏᴀᴅ Ｑᴜᴀʟɪᴛʏ Ｆᴏʀ *${movie.title}*:\n\n`;
      qualities.forEach((q, i) => {
        messageText += `${i + 1}. ${q.quality}\n`;
      });
      messageText += `\n_𝐑ᴇᴘʟ𝐘 𝐖ɪᴛ𝐇 𝐓ʜ𝐄 𝐐ᴜᴀʟɪᴛ𝐘 𝐍ᴜᴍʙᴇ𝐑 (𝐄.𝐠. 1) 𝐓𝐎 𝐃ᴏᴡɴʟᴏᴀ𝐃._\n\nPowered by King-Sandesh-Md V2 💸`;

      await conn.sendMessage(from, { text: messageText });
    }

  } catch (e) {
    console.error(e);
    reply("❌ Error occurred while fetching movie details.");
  }
});


cmd({
  pattern: /^cinesubz_dl_(\d+)$/,
  fromMe: false,
  dontAddCommandList: true,
  filename: __filename
}, async (conn, m, store, { from, match, reply }) => {
  try {
    const session = global.cinesubz_sessions && global.cinesubz_sessions[m.sender];
    if (!session) return reply("❌ Session expired or not found. Please search the movie again.");

    const index = parseInt(match[1]);
    if (isNaN(index) || index < 0 || index >= session.qualities.length) 
      return reply("❌ Invalid selection.");

    const selected = session.qualities[index];
    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const fileExtension = ".mkv";
    const fileName = `${session.movieTitle}_${selected.quality}${fileExtension}`;
    const filePath = path.resolve('./downloads', fileName);

    const downloader = new DownloaderHelper(selected.link, './downloads', {
      fileName: fileName,
      retry: { maxRetries: 3, delay: 2000 }
    });

    downloader.on('end', async () => {
      if (!fs.existsSync(filePath)) return reply("❌ Failed to download the file.");

      await conn.sendMessage(from, {
        document: fs.readFileSync(filePath),
        mimetype: "video/x-matroska",
        fileName: fileName,
        caption: `📥 *${session.movieTitle}* 𝐃ᴏᴡɴʟᴏᴀᴅᴇ𝐃 𝐈𝐍 *${selected.quality}* 𝐐ᴜᴀʟɪᴛ𝐘 (𝐒ᴇɴᴛ 𝐀ꜱ 𝐃ᴏᴄᴜᴍᴇɴᴛ).\n\n> *© Powered By King-Sandesh Md V2 💸*`
      }, { quoted: m });

      fs.unlinkSync(filePath);
    });

    downloader.on('error', (err) => {
      console.error(err);
      reply("❌ Error during download. Please try again later.");
    });

    await downloader.start();

  } catch (e) {
    console.error(e);
    reply("❌ Something went wrong.");
  }
});
