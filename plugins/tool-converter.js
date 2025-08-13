const converter = require('../data/converter');
const stickerConverter = require('../data/sticker-converter');
const { cmd } = require('../command');

cmd({
    pattern: 'convert',
    alias: ['sticker2img', 'stoimg', 'stickertoimage', 's2i'],
    desc: 'Convert stickers to images',
    category: 'media',
    react: '🖼️',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!message.quoted) {
        return await client.sendMessage(from, {
            text: "✨ *𝐒ᴛɪᴄᴋᴇ𝐑 𝐂ᴏɴᴠᴇʀᴛᴇ𝐑 𝐁𝐘 𝐊ꜱᴍ𝐃*\n\nＰʟᴇᴀꜱᴇ Ｒᴇᴘʟʏ Ｔᴏ Ａ Ｓᴛɪᴄᴋᴇʀ Ｍᴀꜱꜱᴀɢᴇ\n\nExample: `.convert` (reply to sticker)"
        }, { quoted: message });
    }

    if (message.quoted.mtype !== 'stickerMessage') {
        return await client.sendMessage(from, {
            text: "❌ Only sticker messages can be converted"
        }, { quoted: message });
    }

    // Send processing message
    await client.sendMessage(from, {
        text: "🔄 𝐂ᴏɴᴠᴇʀᴛɪɴɢ 𝐒ᴛɪᴄᴋᴇʀ 𝐓ᴏ 𝐈ᴍᴀɢᴇ..."
    }, { quoted: message });

    try {
        const stickerBuffer = await message.quoted.download();
        const imageBuffer = await stickerConverter.convertStickerToImage(stickerBuffer);

        // Send result
        await client.sendMessage(from, {
            image: imageBuffer,
            caption: "> *© Powered By King-Sandesh-Md V2 💸*",
            mimetype: 'image/png'
        }, { quoted: message });

    } catch (error) {
        console.error('Conversion error:', error);
        await client.sendMessage(from, {
            text: "❌ Please try with a different sticker."
        }, { quoted: message });
    }
});

cmd({
    pattern: 'tomp3',
    desc: 'Convert media to audio',
    category: 'audio',
    react: '🎵',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*🔊 𝐏ʟᴇᴀꜱᴇ 𝐑ᴇᴘʟʏ 𝐓ᴏ 𝐀 𝐕ɪᴅᴇᴏ/𝐀ᴜᴅɪᴏ 𝐌ᴀꜱꜱᴀɢᴇ*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "❌ Only video/audio messages can be converted"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 300) {
        return await client.sendMessage(from, {
            text: "⏱️ Ｍᴇᴅɪᴀ Ｔᴏᴏ Ｌᴏɴɢ (Ｍᴀx 5 Ｍɪɴᴜᴛᴇꜱ)"
        }, { quoted: message });
    }

    // Send processing message and store it
    await client.sendMessage(from, {
        text: "🔄 𝐂ᴏɴᴠᴇʀᴛɪɴɢ 𝐓ᴏ 𝐀ᴜᴅɪᴏ..."
    }, { quoted: message });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const audio = await converter.toAudio(buffer, ext);

        // Send result
        await client.sendMessage(from, {
            audio: audio,
            mimetype: 'audio/mpeg'
        }, { quoted: message });

    } catch (e) {
        console.error('Conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to process audio"
        }, { quoted: message });
    }
});

cmd({
    pattern: 'toptt',
    desc: 'Convert media to voice message',
    category: 'audio',
    react: '🎙️',
    filename: __filename
}, async (client, match, message, { from }) => {
    // Input validation
    if (!match.quoted) {
        return await client.sendMessage(from, {
            text: "*🗣️ 𝐏ʟᴇᴀꜱᴇ 𝐑ᴇᴘʟʏ 𝐓ᴏ 𝐀 𝐕ɪᴅᴇᴏ/𝐀ᴜᴅɪᴏ 𝐌ᴇꜱꜱᴀɢᴇ*"
        }, { quoted: message });
    }

    if (!['videoMessage', 'audioMessage'].includes(match.quoted.mtype)) {
        return await client.sendMessage(from, {
            text: "❌ Only video/audio messages can be converted"
        }, { quoted: message });
    }

    if (match.quoted.seconds > 300) {
        return await client.sendMessage(from, {
            text: "⏱️ Ｍᴇᴅɪᴀ Ｔᴏᴏ Ｌᴏɴɢ Ｆᴏʀ Ｖᴏɪᴄᴇ (Ｍᴀx 5 Ｍɪɴᴜᴛᴇ)"
        }, { quoted: message });
    }

    // Send processing message
    await client.sendMessage(from, {
            text: "🔄 𝐂ᴏɴᴠᴇʀᴛɪɴɢ 𝐓ᴏ 𝐕ᴏɪᴄᴇ 𝐌ᴇꜱꜱᴀɢᴇ..."
    }, { quoted: message });

    try {
        const buffer = await match.quoted.download();
        const ext = match.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const ptt = await converter.toPTT(buffer, ext);

        // Send result
        await client.sendMessage(from, {
            audio: ptt,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: message });

    } catch (e) {
        console.error('PTT conversion error:', e.message);
        await client.sendMessage(from, {
            text: "❌ Failed to create voice message"
        }, { quoted: message });
    }
});

