const crypto = require("crypto");
const { cmd } = require("../command");

cmd({
  pattern: "gpass",
  desc: "Generate a strong password.",
  category: "other",
  react: '🔐',
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    // Password length specified by the user, defaults to 12 if not provided
    const passwordLength = args[0] ? parseInt(args[0]) : 12;

    // Validate the password length
    if (isNaN(passwordLength) || passwordLength < 8) {
      return reply("❌ Please provide a valid length for the password (Minimum 8 Characters).");
    }

    // Password generation function
    const generatePassword = (length) => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';
      let password = '';
      for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, chars.length);
        password += chars[randomIndex];
      }
      return password;
    };

    // Generate the password
    const generatedPassword = generatePassword(passwordLength);

    // Send the message with the generated password
    await conn.sendMessage(from, {
      text: "🔐 *𝐘ᴏᴜ𝐑 𝐒ᴛʀᴏɴ𝐆 𝐏ᴀꜱꜱᴡᴏʀ𝐃* 🔐\n\n𝐏𝐥𝐞𝐚𝐬𝐞 𝐅𝐢𝐧𝐝 𝐘𝐨𝐮𝐫 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐏𝐚𝐬𝐬𝐰𝐨𝐫𝐝 𝐁𝐞𝐥𝐨𝐰:\n\n" + generatedPassword + "\n\n> *© Powered By King-Sandesh Md V2 💸*"
    }, {
      quoted: quoted
    });
    
  } catch (error) {
    console.error(error);
    reply("❌ Error generating password: " + error.message);
  }
});