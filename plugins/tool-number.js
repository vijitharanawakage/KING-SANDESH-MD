const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "tempnum",
    alias: ["fakenum", "tempnumber"],
    desc: "Get temporary numbers & OTP instructions",
    category: "tools",
    react: "📱",
    use: "<country-code>"
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        // Mandatory country code check
        if (!args || args.length < 1) {
            return reply(`❌ *Usage:* .tempnum <country-code>\nExample: .tempnum us\n\n📦 Use .otpbox <number>* to check OTPs`);
        }

        const countryCode = args[0].toLowerCase();
        
        // API call with validation
        const { data } = await axios.get(
            `https://api.vreden.my.id/api/tools/fakenumber/listnumber?id=${countryCode}`,
            { 
                timeout: 10000,
                validateStatus: status => status === 200
            }
        );

        // Fixed syntax error here - added missing parenthesis
        if (!data?.result || !Array.isArray(data.result)) {
            console.error("Invalid API structure:", data);
            return reply(`⚠ Invalid API response format\nTry .tempnum us`);
        }

        if (data.result.length === 0) {
            return reply(`📭 𝐍ᴏ 𝐍ᴜᴍʙᴇʀꜱ 𝐀ᴠᴀɪʟᴀʙʟᴇ 𝐅ᴏʀ *${countryCode.toUpperCase()}*\n𝐓ʀʏ 𝐀ɴᴏᴛʜᴇʀ 𝐂ᴏᴜᴛʀʏ 𝐂ᴏᴅᴇ..!\n\nUse .otpbox <number> after selection`);
        }

        // Process numbers
        const numbers = data.result.slice(0, 25);
        const numberList = numbers.map((num, i) => 
            `${String(i+1).padStart(2, ' ')}. ${num.number}`
        ).join("\n");

        // Final message with OTP instructions
        await reply(
            `╭──「 📱 𝐓ᴇᴍᴘᴏʀᴀʀ𝐘 𝐍ᴜᴍʙᴇʀ𝐒 」\n` +
            `│\n` +
            `│ 𝙲𝙾𝚄𝙽𝚃𝚁𝚈: ${countryCode.toUpperCase()}\n` +
            `│ 𝙽𝚄𝙼𝙱𝙴𝚁𝚂 𝙵𝙾𝚄𝙽𝙳: ${numbers.length}\n` +
            `│\n` +
            `${numberList}\n\n` +
            `╰──「 📦 𝚄𝚂𝙴: .otpbox <number> 」\n` +
            `_Example: .otpbox +1234567890_`
        );

    } catch (err) {
        console.error("API Error:", err);
        const errorMessage = err.code === "ECONNABORTED" ? 
            `⏳ *ᴛɪᴍᴇ ᴏᴜᴛ*: API took too long\nTry smaller country codes like 'us', 'gb'` :
            `⚠ *ᴇʀʀᴏʀ*: ${err.message}\nUse format: .tempnum <country-code>`;
            
        reply(`${errorMessage}\n\n🔑 𝐑ᴇᴍᴇᴍʙᴇ𝐑: ${prefix}otpinbox <number>`);
    }
});

cmd({
    pattern: "templist",
    alias: ["tempnumberlist", "tempnlist", "listnumbers"],
    desc: "Show list of countries with temp numbers",
    category: "tools",
    react: "🌍",
    filename: __filename,
    use: ".templist"
},
async (conn, m, { reply }) => {
    try {
        const { data } = await axios.get("https://api.vreden.my.id/api/tools/fakenumber/country");

        if (!data || !data.result) return reply("❌ Couldn't fetch country list.");

        const countries = data.result.map((c, i) => `*${i + 1}.* ${c.title} \`(${c.id})\``).join("\n");

        await reply(`🌍 *𝐓ᴏᴛᴀ𝐋 𝐀ᴠᴀɪʟᴀʙʟ𝐄 𝐂ᴏᴜɴᴛʀɪᴇ𝐒:* ${data.result.length}\n\n${countries}`);
    } catch (e) {
        console.error("TEMP LIST ERROR:", e);
        reply("❌ Failed to fetch temporary number country list.");
    }
});

cmd({
    pattern: "otpbox",
    alias: ["checkotp", "getotp"],
    desc: "Check OTP messages for temporary number",
    category: "tools",
    react: "🔑",
    use: "<full-number>"
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        // Validate input
        if (!args[0] || !args[0].startsWith("+")) {
            return reply(`❌ *Usage:* .otpbox <full-number>\nExample: .otpbox +9231034481xx`);
        }

        const phoneNumber = args[0].trim();
        
        // Fetch OTP messages
        const { data } = await axios.get(
            `https://api.vreden.my.id/api/tools/fakenumber/message?nomor=${encodeURIComponent(phoneNumber)}`,
            { 
                timeout: 10000,
                validateStatus: status => status === 200
            }
        );

        // Validate response
        if (!data?.result || !Array.isArray(data.result)) {
            return reply("⚠ No OTP messages found for this number");
        }

        // Format OTP messages
        const otpMessages = data.result.map(msg => {
            // Extract OTP code (matches common OTP patterns)
            const otpMatch = msg.content.match(/\b\d{4,8}\b/g);
            const otpCode = otpMatch ? otpMatch[0] : "Not found";
            
            return `┌ *𝙵𝚁𝙾𝙼:* ${msg.from || "Unknown"}
│ *𝙲𝙾𝙳𝙴:* ${otpCode}
│ *𝚃𝙸𝙼𝙴:* ${msg.time_wib || msg.timestamp}
└ *𝙼𝙴𝚂𝚂𝙰𝙶𝙴:* ${msg.content.substring(0, 50)}${msg.content.length > 50 ? "..." : ""}`;
        }).join("\n\n");

        await reply(
            `╭──「 🔑 𝐎ᴛ𝐏 𝐌ᴇꜱꜱᴀɢᴇ𝐒 」\n` +
            `│ 𝙽𝚄𝙼𝙱𝙴𝚁: ${phoneNumber}\n` +
            `│ 𝙼𝙴𝚂𝚂𝙰𝙶𝙴𝚂 𝙵𝙾𝚄𝙽𝙳: ${data.result.length}\n` +
            `│\n` +
            `${otpMessages}\n` +
            `╰──「 📌 Use .tempnum to get numbers 」`
        );

    } catch (err) {
        console.error("OTP Check Error:", err);
        const errorMsg = err.code === "ECONNABORTED" ?
            "⌛ 𝐎ᴛᴘ 𝐂ʜᴇᴄᴋ 𝐓ɪᴍᴇᴅ 𝐎ᴜᴛ. 𝐓ʀʏ 𝐀ɢᴀɪɴ 𝐋ᴀᴛᴇʀ" :
            `⚠ Error: ${err.response?.data?.error || err.message}`;
        
        reply(`${errorMsg}\n\nUsage: .otpbox +947412593xx`);
    }
});
