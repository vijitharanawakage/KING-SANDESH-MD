const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "oresult",
    desc: "Get G.C.E. O/L result by index or NIC number.",
    category: "education",
    react: "📄",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, args }) => {
    try {
        const query = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?oresult\s?/i, '').trim();

        if (!query) {
            return reply("📄 Please provide your *Index Number* or *NIC Number*.\n\n📌 Example: `.oresult 41529243`");
        }

        const apiUrl = `https://api.omindu.dev/api/exam/ol?index=${encodeURIComponent(query)}`;
        const res = await axios.get(apiUrl);
        const data = res.data;

        if (!data.success || !data.result) {
            return reply("❌ No result found. Please check your Index or NIC number.");
        }

        const details = data.result.examinationDetails;
        const subjects = data.result.subjectResults;

        const resultText = subjects.map(sub => `📘 ${sub.subject}: *${sub.result}*`).join('\n');

        const finalMessage = `🎓 *𝐆.𝐂.𝐄. 𝐎/𝐋 𝐄xᴀᴍɪɴᴀᴛɪᴏ𝐍 - ${details.year}*\n\n` +
                             `👤 *𝙽𝙰𝙼𝙴:* ${details.name}\n` +
                             `🆔 *𝙸𝙽𝙳𝙴𝚇:* ${details.indexNumber}\n` +
                             `🪪 *𝙽𝙸𝙲:* ${details.nicNumber}\n\n` +
                             `📚 *𝚂𝚄𝙱𝙹𝙴𝙲𝚃 𝚁𝙴𝚂𝚄𝙻𝚃𝚂:*\n${resultText}\n\n` +
                             `> *© Powered By King-Sandesh-Md V2 💸*`;

        await conn.sendMessage(
            from,
            {
                text: finalMessage,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error("Oresult Command Error:", error);
        reply("⚠️ Error fetching the result. Please try again later.");
    }
});
