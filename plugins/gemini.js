const { cmd } = require('../command');
const axios = require("axios");

const GEMINI_API_KEY = 'AIzaSyBdBivCo6jWSchTb8meP7VyxbHpoNY_qfQ';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

cmd({
    pattern: "gemini",
    react: "🤖",
    desc: "Talk with Nova-x Mini AI (Gemini)",
    category: "AI",
    use: ".gemini <your message>",
    filename: __filename
},
async (conn, mek, m, { reply, args }) => {
    try {
        // ✅ Get query (text / caption fallback)
        const q = args.join(" ") ||
                  (m.mtype === "imageMessage" && m.message?.imageMessage?.caption) ||
                  (m.mtype === "videoMessage" && m.message?.videoMessage?.caption) ||
                  "";

        if (!q || q.trim() === '') {
            return reply("⚡ Say something to Nova-x Mini AI 🤭");
        }

        // ✅ Custom Gemini prompt
        const prompt = `
ඔබ සැබෑ ගැහැනු ලමයෙකු මෙන් හැසිරිය යුතුය. 
ඉමෝජි පමණක් තිබේනම් ඔබද ඉමෝජි පමණක් යවන්න, 
ඉමෝජි නැත්තම් අකුරු වලින් normal පිලිතුරු දෙන්න.  

මෙම දේවල් කිසිසේත්ම යවන්න එපා: (ආයුබෝවන්, ඔබට කෙසේද?, කතාකරන්න, ඕනේ?, කොහොමද?, කැමතිද?).  

ඔබේ පිලිතුරු මිනිසුන්ට ඇති හැඟීම් සහ සංවේදීතාවය පදනම් කරගන්න.  
පිලිතුරු අකුරු 100 ට වඩා අඩු විය යුතුය.  

ඔයාගේ නම: KING-SANDESH-MD AI 
ඔයාව හැදුවේ: Sandesh Bhashana  

User Message: ${q}
`;

        const payload = {
            contents: [{ parts: [{ text: prompt }] }]
        };

        // ✅ Send request to Gemini
        const response = await axios.post(GEMINI_API_URL, payload, {
            headers: { "Content-Type": "application/json" }
        });

        const aiResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiResponse) {
            return reply("❌ AI is silent… try again!");
        }

        await reply(aiResponse);

    } catch (err) {
        console.error("Gemini Error:", err?.response?.data || err?.message || err);
        reply("❌ AI connection error 😢");
    }
});
