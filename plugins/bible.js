import config from '../../config.cjs';
import fetch from 'node-fetch';

const bible = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "bible") {
    if (!text) {
      await m.reply(`Please specify a Bible reference (e.g., John 3:16).`);
      return;
    }

    const start = new Date().getTime();
    await m.React('⏳');

    try {
      const apiUrl = `https://bible-api.com/${encodeURIComponent(text)}`;
      const response = await fetch(apiUrl);
      const data = await response.json();
      const end = new Date().getTime();
      const responseTime = end - start;

      if (data.error) {
        await m.reply(`Error fetching verse: ${data.error}`);
      } else if (data.text) {
        const verseText = data.text.trim();
        const reference = data.reference;
        const formattedText = `─═< ◉ >═─\n\n*${reference}*\n\n${verseText}\n\n─═< ◉ >═─\n_Fetched in ${responseTime} ms_`;
        sock.sendMessage(m.from, { text: formattedText }, { quoted: m });
      } else {
        await m.reply(`Could not find the specified Bible reference.`);
      }
    } catch (error) {
      console.error("Error fetching Bible verse:", error);
      await m.reply(`An error occurred while fetching the verse.`);
    } finally {
      await m.React('✅');
    }
  }
}

export default bible;
