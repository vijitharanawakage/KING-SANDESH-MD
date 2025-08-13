const { sleep } = require('../lib/functions');
const {cmd , commands} = require('../command')

cmd({
    pattern: "rcolor",
    desc: "Generate a random color with name and code.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        const colorNames = [
            "Red", "Green", "Blue", "Yellow", "Orange", "Purple", "Pink", "Brown", "Black", "White", 
            "Gray", "Cyan", "Magenta", "Violet", "Indigo", "Teal", "Lavender", "Turquoise"
        ];
        
        const randomColorHex = "#" + Math.floor(Math.random()*16777215).toString(16);
        const randomColorName = colorNames[Math.floor(Math.random() * colorNames.length)];

        reply(`🎨 *𝐑ᴀɴᴅᴏ𝐌 𝐂ᴏʟᴏ𝐑:* \n𝙽𝙰𝙼𝙴: ${randomColorName}\n𝙲𝙾𝙳𝙴: ${randomColorHex}`);
    } catch (e) {
        console.error("Error in .randomcolor command:", e);
        reply("❌ An error occurred while generating the random color.");
    }
});

cmd({
    pattern: "binary",
    desc: "Convert text into binary format.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the text to convert to binary.");

        const textToConvert = args.join(" ");
        const binaryText = textToConvert.split('').map(char => {
            return `00000000${char.charCodeAt(0).toString(2)}`.slice(-8);
        }).join(' ');

        reply(`🔑 *𝐁ɪɴᴀʀ𝐘 𝐑ᴇᴘʀᴇꜱᴇɴᴛᴀᴛɪᴏ𝐍:* \n${binaryText}`);
    } catch (e) {
        console.error("Error in .binary command:", e);
        reply("❌ An error occurred while converting to binary.");
    }
});

cmd({
    pattern: "dbinary",
    desc: "Decode binary string into text.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the binary string to decode.");

        const binaryString = args.join(" ");
        const textDecoded = binaryString.split(' ').map(bin => {
            return String.fromCharCode(parseInt(bin, 2));
        }).join('');

        reply(`🔓 *𝐃ᴇᴄᴏᴅᴇ𝐃 𝐓ᴇx𝐓:* \n${textDecoded}`);
    } catch (e) {
        console.error("Error in .binarydecode command:", e);
        reply("❌ An error occurred while decoding the binary string.");
    }
});


cmd({
    pattern: "base64",
    desc: "Encode text into Base64 format.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure the user provided some text
        if (!args.length) return reply("❌ Please provide the text to encode into Base64.");

        const textToEncode = args.join(" ");
        
        // Encode the text into Base64
        const encodedText = Buffer.from(textToEncode).toString('base64');
        
        // Send the encoded Base64 text
        reply(`🔑 *𝐄ɴᴄᴏᴅᴇ𝐃 𝐁ᴀꜱᴇ64 𝐓ᴇx𝐓:* \n${encodedText}`);
    } catch (e) {
        console.error("Error in .base64 command:", e);
        reply("❌ An error occurred while encoding the text into Base64.");
    }
});

cmd({
    pattern: "unbase64",
    desc: "Decode Base64 encoded text.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure the user provided Base64 text
        if (!args.length) return reply("❌ Please provide the Base64 encoded text to decode.");

        const base64Text = args.join(" ");
        
        // Decode the Base64 text
        const decodedText = Buffer.from(base64Text, 'base64').toString('utf-8');
        
        // Send the decoded text
        reply(`🔓 *𝐃ᴇᴄᴏᴅᴇ𝐃 𝐓ᴇx𝐓:* \n${decodedText}`);
    } catch (e) {
        console.error("Error in .unbase64 command:", e);
        reply("❌ An error occurred while decoding the Base64 text.");
    }
});

cmd({
    pattern: "urlencode",
    desc: "Encode text into URL encoding.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the text to encode into URL encoding.");

        const textToEncode = args.join(" ");
        const encodedText = encodeURIComponent(textToEncode);

        reply(`🔑 *𝐄ɴᴄᴏᴅᴇ𝐃 𝐔ʀ𝐋 𝐓ᴇx𝐓:* \n${encodedText}`);
    } catch (e) {
        console.error("Error in .urlencode command:", e);
        reply("❌ An error occurred while encoding the text.");
    }
});

cmd({
    pattern: "urldecode",
    desc: "Decode URL encoded text.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        if (!args.length) return reply("❌ Please provide the URL encoded text to decode.");

        const encodedText = args.join(" ");
        const decodedText = decodeURIComponent(encodedText);

        reply(`🔓 *𝐃ᴇᴄᴏᴅᴇ𝐃 𝐓ᴇx𝐓:* \n${decodedText}`);
    } catch (e) {
        console.error("Error in .urldecode command:", e);
        reply("❌ An error occurred while decoding the URL encoded text.");
    }
});

cmd({
    pattern: "roll",
    desc: "Roll a dice (1-6).",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        // Roll a dice (generate a random number between 1 and 6)
        const result = Math.floor(Math.random() * 6) + 1;
        
        // Send the result
        reply(`🎲 𝐘ᴏ𝐔 𝐑ᴏʟʟᴇ𝐃: *${result}*`);
    } catch (e) {
        console.error("Error in .roll command:", e);
        reply("❌ An error occurred while rolling the dice.");
    }
}); 


cmd({
    pattern: "coinflip",
    desc: "Flip a coin and get Heads or Tails.",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        // Simulate coin flip (randomly choose Heads or Tails)
        const result = Math.random() < 0.5 ? "Heads" : "Tails";
        
        // Send the result
        reply(`🪙 𝐂ᴏɪ𝐍 𝐅ʟɪ𝐏 𝐑ᴇꜱᴜʟ𝐓: *${result}*`);
    } catch (e) {
        console.error("Error in .coinflip command:", e);
        reply("❌ An error occurred while flipping the coin.");
    }
});

cmd({
    pattern: "flip",
    desc: "Flip the text you provide.",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure text is provided
        if (!args.length) return reply("❌ Please provide the text to flip.");

        // Flip the text
        const flippedText = args.join(" ").split('').reverse().join('');
        
        // Send the flipped text
        reply(`🔄 𝐅ʟɪᴘᴘᴇ𝐃 𝐓ᴇx𝐓: *${flippedText}*`);
    } catch (e) {
        console.error("Error in .flip command:", e);
        reply("❌ An error occurred while flipping the text.");
    }
});

cmd({
    pattern: "pick",
    desc: "Pick between two choices.",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure two options are provided
        if (args.length < 2) return reply("❌ Please provide two choices to pick from. Example: `.pick Ice Cream, Pizza`");

        // Pick a random option
        const option = args.join(" ").split(',')[Math.floor(Math.random() * 2)].trim();
        
        // Send the result
        reply(`🎉 𝐁ᴏ𝐓 𝐏ɪᴄᴋ𝐒: *${option}*`);
    } catch (e) {
        console.error("Error in .pick command:", e);
        reply("❌ An error occurred while processing your request.");
    }
});

cmd({
    pattern: "timenow",
    desc: "Check the current local time.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        // Get current date and time
        const now = new Date();
        
        // Get local time in Sri lankan timezone (Asia/Colombo)
        const localTime = now.toLocaleTimeString("en-US", { 
            hour: "2-digit", 
            minute: "2-digit", 
            second: "2-digit", 
            hour12: true,
            timeZone: "Asia/Colombo" // Setting Sri Lanka's time zone explicitly
        });
        
        // Send the local time as reply
        reply(`🕒 𝐂ᴜʀʀᴇɴ𝐓 𝐋ᴏᴄᴀ𝐋 𝐓ɪᴍ𝐄 𝐈𝐍 𝐒ʀ𝐈 𝐋ᴀɴᴋ𝐀: ${localTime}`);
    } catch (e) {
        console.error("Error in .timenow command:", e);
        reply("❌ An error occurred. Please try again later.");
    }
});

cmd({
    pattern: "date",
    desc: "Check the current date.",
    category: "utility",
    filename: __filename,
}, 
async (conn, mek, m, { reply }) => {
    try {
        // Get current date
        const now = new Date();
        
        // Get the formatted date (e.g., "Monday, January 15, 2025")
        const currentDate = now.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });
        
        // Send the current date as reply
        reply(`📅 𝐂ᴜʀʀᴇɴ𝐓 𝐃ᴀᴛ𝐄: ${currentDate}`);
    } catch (e) {
        console.error("Error in .date command:", e);
        reply("❌ An error occurred. Please try again later.");
    }
});

cmd({
    pattern: "shapar",
    desc: "Send shapar ASCII art with mentions.",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        // Ensure the command is used in a group
        if (!isGroup) {
            return reply("This command can only be used in groups.");
        }

        // Extract the mentioned user
        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) {
            return reply("Please mention a user to send the ASCII art to.");
        }

        // Shapar ASCII Art
        const asciiArt = `
          _______
       .-'       '-.
      /           /|
     /           / |
    /___________/  |
    |   _______ |  |
    |  |  \\ \\  ||  |
    |  |   \\ \\ ||  |
    |  |____\\ \\||  |
    |  '._  _.'||  |
    |    .' '.  ||  |
    |   '.___.' ||  |
    |___________||  |
    '------------'  |
     \\_____________\\|
`;

        // Message to send
        const message = `😂 @${mentionedUser.split("@")[0]}!\n😂 𝐓ʜᴀᴛ 𝐅ᴏʀ 𝐘ᴏᴜ:\n\n${asciiArt}`;

        // Send the message with mentions
        await conn.sendMessage(from, {
            text: message,
            mentions: [mentionedUser],
        }, { quoted: m });

    } catch (e) {
        console.error("Error in .shapar command:", e);
        reply("An error occurred while processing the command. Please try again.");
    }
});

cmd({
    pattern: "rate",
    desc: "Rate someone out of 10.",
    category: "fun",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, reply }) => {
    try {
        if (!isGroup) return reply("This command can only be used in groups.");

        const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
        if (!mentionedUser) return reply("Please mention someone to rate.");

        const randomRating = Math.floor(Math.random() * 10) + 1;
        const message = `@${mentionedUser.split("@")[0]} is rated ${randomRating}/10.`;

        await conn.sendMessage(from, { text: message, mentions: [mentionedUser] }, { quoted: m });
    } catch (e) {
        console.error("Error in .rate command:", e);
        reply("An error occurred. Please try again.");
    }
});

cmd({
    pattern: "countx",
    desc: "Start a reverse countdown from the specified number to 1.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { args, reply, senderNumber }) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("❎ Only the bot owner can use this command.");
        }

        // Ensure arguments are provided
        if (!args[0]) {
            return reply("✳️ Use this command like:\n *Example:* .countx 10");
        }

        const count = parseInt(args[0].trim());

        // Validate the input
        if (isNaN(count) || count <= 0 || count > 50) {
            return reply("❎ Please specify a valid number between 1 and 50.");
        }

        reply(`⏳ 𝐒ᴛᴀʀᴛɪɴɢ 𝐑ᴇᴠᴇʀꜱᴇ 𝐂ᴏᴜɴᴛᴅᴏᴡɴ 𝐅ʀᴏᴍ ${count}...`);

        for (let i = count; i >= 1; i--) {
            await conn.sendMessage(m.chat, { text: `${i}` }, { quoted: mek });
            await sleep(1000); // 1-second delay between messages
        }

        reply(`✅ 𝐂ᴏᴜɴᴛᴅᴏᴡɴ 𝐂ᴏᴍᴘʟᴇᴛᴇᴅ.`);
    } catch (e) {
        console.error(e);
        reply("❎ An error occurred while processing your request.");
    }
});

cmd({
    pattern: "count",
    desc: "Start a countdown from 1 to the specified number.",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { args, reply, senderNumber }) => {
    try {
        // Get the bot owner's number dynamically from conn.user.id
        const botOwner = conn.user.id.split(":")[0]; // Extract the bot owner's number
        if (senderNumber !== botOwner) {
            return reply("❎ Only the bot owner can use this command.");
        }

        // Ensure arguments are provided
        if (!args[0]) {
            return reply("✳️ Use this command like:\n *Example:* .count 10");
        }

        const count = parseInt(args[0].trim());

        // Validate the input
        if (isNaN(count) || count <= 0 || count > 50) {
            return reply("❎ Please specify a valid number between 1 and 50.");
        }

        reply(`⏳ 𝐒ᴛᴀʀᴛɪɴɢ 𝐂ᴏᴜɴᴛᴅᴏᴡɴ 𝐓ᴏ ${count}...`);

        for (let i = 1; i <= count; i++) {
            await conn.sendMessage(m.chat, { text: `${i}` }, { quoted: mek });
            await sleep(1000); // 1-second delay between messages
        }

        reply(`✅ 𝐂ᴏᴜɴᴛᴅᴏᴡɴ 𝐂ᴏᴍᴘʟᴇᴛᴇᴅ.`);
    } catch (e) {
        console.error(e);
        reply("❎ An error occurred while processing your request.");
    }
});


cmd({
    pattern: "calculate",
    alias: ["calc"],
    desc: "Evaluate a mathematical expression.",
    category: "utilities",
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    try {
        // Ensure arguments are provided
        if (!args[0]) {
            return reply("✳️ Use this command like:\n *Example:* .calculate 5+3*2");
        }

        const expression = args.join(" ").trim();

        // Validate the input to prevent unsafe operations
        if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
            return reply("❎ Invalid expression. Only numbers and +, -, *, /, ( ) are allowed.");
        }

        // Evaluate the mathematical expression
        let result;
        try {
            result = eval(expression);
        } catch (e) {
            return reply("❎ Error in calculation. Please check your expression.");
        }

        // Reply with the result
        reply(`✅ 𝐑ᴇꜱᴜʟᴛ 𝐎ꜰ "${expression}" 𝐈ꜱ: ${result}`);
    } catch (e) {
        console.error(e);
        reply("❎ An error occurred while processing your request.");
    }
});