const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const config = require('../config');    
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Fetch information about a GitHub repository.",
    react: "📂",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/vijitharanawakage/KING-SANDESH-MD';

    try {
        // Extract username and repo name from the URL
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        // Fetch repository details using GitHub API
        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        
        if (!response.ok) {
            throw new Error(`GitHub API request failed with status ${response.status}`);
        }

        const repoData = await response.json();

        // Format the repository information
        const formattedInfo = `*ＢＯＴ ＮＡＭＥ:*\n> ${repoData.name}\n\n*ＯＷＮＥＲ ＮＡＭＥ:*\n> ${repoData.owner.login}\n\n*ＳＴＡＲＳ:*\n> ${repoData.stargazers_count}\n\n*ＦＯＲＫＳ:*\n> ${repoData.forks_count}\n\n*ＧＩＴＨＵＢ ＬＩＮＫ:*\n> ${repoData.html_url}\n\n*ＤＥＳＣＲＩＰＴＩＯＮ:*\n> ${repoData.description || 'No description'}\n\n*✋ 𝙳𝙾𝙽'𝚃 𝙵𝙾𝚁𝙶𝙴𝚃 𝚃𝙾 𝚂𝚃𝙰𝚁 𝙰𝙽𝙳 𝙵𝙾𝚁𝙺 𝚁𝙴𝙿𝙾𝚂𝙸𝚃𝙾𝚁𝚈*\n\n> *© Powered By King-Sandesh Md V2 💸*`;

        // Send image with caption
        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/m5drmn.png` },
            caption: formattedInfo,
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

        // Send local audio file
        const audioPath = path.join(__dirname, '../assets/menuv.mp4');
        await conn.sendMessage(from, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            ptt: true,
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
        console.error("Error in repo command:", error);
        reply("Sorry, something went wrong while fetching the repository information. Please try again later.");
    }
});
