const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "define",
    desc: "📖 Get the definition of a word",
    react: "🔍",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a word to define.\n\n📌 *Usage:* .define [word]");

        const word = q.trim();
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await axios.get(url);
        const definitionData = response.data[0];

        const definition = definitionData.meanings[0].definitions[0].definition;
        const example = definitionData.meanings[0].definitions[0].example || '❌ No example available';
        const synonyms = definitionData.meanings[0].definitions[0].synonyms.join(', ') || '❌ No synonyms available';
        const phonetics = definitionData.phonetics[0]?.text || '🔇 𝐍𝐨 𝐏𝐡𝐨𝐧𝐞𝐭𝐢𝐜𝐬 𝐀𝐯𝐚𝐢𝐥𝐚𝐛𝐥𝐞';
        const audio = definitionData.phonetics[0]?.audio || null;

        const wordInfo = `
📖 *𝚆𝙾𝚁𝙳*: *${definitionData.word}*  
🗣️ *𝙿𝚁𝙾𝙽𝙾𝚄𝙽𝙲𝙸𝙰𝚃𝙸𝙾𝙽*: _${phonetics}_  
📚 *𝙳𝙴𝙵𝙸𝙽𝙸𝚃𝙸𝙾𝙽*: ${definition}  
✍️ *𝙴𝚇𝙰𝙼𝙿𝙻𝙴*: ${example}  
📝 *𝚂𝚈𝙽𝙾𝙽𝚈𝙼𝚂*: ${synonyms}  

> *© Powered By King-Sandesh-Md V2 💸*`;

        if (audio) {
            await conn.sendMessage(from, { audio: { url: audio }, mimetype: 'audio/mpeg' }, { quoted: mek });
        }

        return reply(wordInfo);
    } catch (e) {
        console.error("❌ Error:", e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 *Word not found.* Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the definition. Please try again later.");
    }
});
