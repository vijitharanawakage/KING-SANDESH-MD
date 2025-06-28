import config from '../../config.cjs';
import fetch from 'node-fetch';

const movie = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === 'movie') {
    if (!text) {
      await sock.sendMessage(
        m.from,
        { text: `🍿 Please provide a movie name!\n\nExample: \`${prefix}movie The Matrix\` 🎬` },
        { quoted: m }
      );
      return;
    }

    await m.react('🔎'); // React while searching

    const apiKey = config.OMDb_API_KEY;
    const apiUrl = `https://www.omdbapi.com/?t=${encodeURIComponent(text)}&apikey=${apiKey}&plot=full`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data.Response === 'True') {
        const movieInfo = `
🌟 *~𝙺ɪɴɢ 𝚂ᴀɴᴅᴇꜱʜ 𝙼ᴅ 𝙼ᴏᴠɪᴇ 𝙵ɪɴᴅᴇʀ~* 🌟

🎬 *Title:* ${data.Title} (${data.Year})
⭐ *IMDb Rating:* ${data.imdbRating} (${data.imdbVotes} votes)
🎭 *Genre:* ${data.Genre}
🗓️ *Released:* ${data.Released}
⏳ *Runtime:* ${data.Runtime}
🎬 *Director:* ${data.Director}
✍️ *Writer(s):* ${data.Writer}
👨‍👩‍👧‍👦 *Cast:* ${data.Actors}
📜 *Plot:* ${data.Plot}
🌍 *Country:* ${data.Country}
🗣️ *Language(s):* ${data.Language}
🏆 *Awards:* ${data.Awards}
📦 *Box Office:* ${data.BoxOffice !== 'N/A' ? data.BoxOffice : 'Not Available'}
📀 *DVD Release:* ${data.DVD !== 'N/A' ? data.DVD : 'Not Available'}
🌐 *Website:* ${data.Website !== 'N/A' ? data.Website : 'Not Available'}

🍿 Enjoy the show! 🍿
`.trim();

        if (data.Poster && data.Poster !== 'N/A') {
          await sock.sendMessage(m.from, { image: { url: data.Poster }, caption: movieInfo }, { quoted: m });
        } else {
          await sock.sendMessage(m.from, { text: movieInfo }, { quoted: m });
        }

        await m.react('✅'); // Success
      } else {
        await sock.sendMessage(
          m.from,
          { text: `🚫 Movie not found! Reason: ${data.Error} 🚫` },
          { quoted: m }
        );
        await m.react('⚠️'); // Not found
      }
    } catch (error) {
      console.error('💔 Error fetching movie data:', error);
      await sock.sendMessage(
        m.from,
        { text: '⚠️ An error occurred while searching for the movie. Please try again later.' },
        { quoted: m }
      );
      await m.react('❌'); // Error
    }
  }
};

export default movie;
