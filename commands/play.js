const yts = require('yt-search');
const fetch = require('node-fetch');

module.exports = {
    name: 'play',
    description: 'Play music from YouTube',
    async execute(message, args) {
        try {
            if (!args[0]) {
                return message.reply('Please specify the song you want to download.');
            }

            const text = args.join(' ');

            // Perform a YouTube search
            const search = await yts(text);
            if (!search.all || search.all.length === 0) {
                return message.reply('No results found for your query.');
            }

            const link = search.all[0].url;

            // Generate the API URL
            const apiUrl = `https://apis-keith.vercel.app/download/dlmp3?url=${link}`;

            // Fetch the audio data from the API
            const response = await fetch(apiUrl);
            if (!response.ok) {
                return message.reply('Failed to fetch data from the API. Please try again.');
            }

            const data = await response.json();

            // Check if the API response contains the expected result
            if (data.status && data.result) {
                const { title, downloadUrl, format, quality } = data.result;
                const thumbnail = search.all[0].thumbnail;

                // Send a message with song details and thumbnail
                await message.reply({
                    image: { url: thumbnail },
                    caption: `
╭═════════════════⊷
║ *Title*: ${title}
║ *Format*: ${format}
║ *Quality*: ${quality}
╰═════════════════⊷
*Powered by KING-SANDESH-MD*`
                });

                // Send the audio file
                await message.reply({
                    audio: { url: downloadUrl },
                    mimetype: "audio/mp4"
                });

                // Send the audio file as a document
                await message.reply({
                    document: { url: downloadUrl },
                    mimetype: "audio/mp3",
                    fileName: `${title.replace(/[^a-zA-Z0-9 ]/g, "")}.mp3`
                });

            } else {
                return message.reply('Unable to fetch the song. Please try again later.');
            }
        } catch (error) {
            console.error('Error in play command:', error);
            return message.reply(`An error occurred: ${error.message}`);
        }
    }
}; 

/*Powered by KING-SANDESH-MD*
*Credits to Keith MD*`*/