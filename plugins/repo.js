import config from '../../config.cjs';
import fetch from 'node-fetch'; // Ensure you have this installed

const repo = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd === "repo") {
    await m.React('🖇️'); // A gem for a precious repo!
    const repoUrl = 'https://github.com/vijitharanawakage/KING-SANDESH-MD';
    const imageUrl = 'https://imgur.com/a/jgZN1dp'; // ❗ REPLACE WITH YOUR ACTUAL IMAGE URL

    try {
      const apiUrl = `https://api.github.com/repos/vijitharanawakage/KING-SANDESH-MD`;
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && data.forks_count !== undefined && data.stargazers_count !== undefined) {
        const stylishMessage = {
          image: { url: imageUrl },
          caption: `
╭───『 KING-SANDESH-MD REPO 』───⳹
│
│🚀 *Explore the Innovation Hub!*
│
│ 📦 *Repository*: ${repoUrl}   
│ 👑 *Owner*: Mr Sandesh Bhashana 
│ ⭐ *Stars*: \`${data.stargazers_count}\` 
│ ⑂ *Forks*: \`${data.forks_count}\`  
│ 🔗 *URL*: https://whatsapp.com/channel/0029Vb5saAU4Y9lfzhgBmS2N
│
│ 📝 *Description*: This is ultimate AI powered multi device third party whatsapp bot
│ 🤝 *Join the Community!* 
│   Contribute & Shape the Future!  
│
╰────────────────⳹
> *© Powered By King-Sandesh-Md V2*🩷
`.trim(),
        };

        sock.sendMessage(m.from, stylishMessage, { quoted: m });
      } else {
        sock.sendMessage(m.from, { text: '⚠️ Could not retrieve full repo details. Please try again later. 🥺', quoted: m });
      }
    } catch (error) {
      console.error("Error fetching repo info:", error);
      sock.sendMessage(m.from, { text: '🚨 Error encountered while fetching repo data. 😢', quoted: m });
    } finally {
      await m.React('✅');
    }
  }
};

export default repo;
