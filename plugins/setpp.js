import { downloadMediaMessage } from '@whiskeysockets/baileys';
import Jimp from 'jimp';
import config from '../config.cjs';

const setProfilePicture = async (m, sock) => {
  const botNumber = await sock.decodeJid(sock.user.id);
  const isBot = m.sender === botNumber;
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';

  if (cmd !== "setpp") return;

  if (!isBot) {
    return m.reply("❌ *Only the bot user can use this command.*");
  }

  if (!m.quoted?.message?.imageMessage) {
    return m.reply("⚠️ *Please reply to an image to set as profile picture.*");
  }

  await m.React('⏳');

  try {
    let media;
    for (let i = 0; i < 3; i++) {
      try {
        media = await downloadMediaMessage(m.quoted, 'buffer');
        if (media) break;
      } catch (err) {
        if (i === 2) {
          await m.React('❌');
          return m.reply("❌ *Failed to download image. Please try again.*");
        }
      }
    }

    const image = await Jimp.read(media);
    if (!image) throw new Error("Invalid image");

    const size = Math.max(image.bitmap.width, image.bitmap.height);
    if (image.bitmap.width !== image.bitmap.height) {
      const squareImage = new Jimp(size, size, 0x000000FF);
      squareImage.composite(image, (size - image.bitmap.width) / 2, (size - image.bitmap.height) / 2);
      image.clone(squareImage);
    }

    image.resize(640, 640);
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    await sock.updateProfilePicture(botNumber, buffer);
    await m.React('✅');

    return sock.sendMessage(
      m.from,
      {
        text: `
┌─〔 *DP UPDATED* 〕─◉
│
│ ✅ *Profile Picture set successfully!*
│ 🛡️ *Bot:* ${botNumber.split("@")[0]}
│
└─➤ *© Powered By King-Sandesh-Md V2 💸*
        `.trim(),
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363402220977044@newsletter',
            newsletterName: "<| 𝐊𝐈𝐍𝐆-𝐒𝐀𝐍𝐃𝐄𝐒𝐇-𝐌𝐃 𝐕❷🫧",
            serverMessageId: 143
          }
        }
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("Profile Picture Error:", error);
    await m.React('❌');
    return m.reply("❌ *An error occurred while updating profile picture.*");
  }
};

export default setProfilePicture;
