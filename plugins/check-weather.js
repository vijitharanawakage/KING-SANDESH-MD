const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');
cmd({
    pattern: "weather",
    desc: "🌤 Get weather information for a location",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a city name. Usage: .weather [city name]");
        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
        const city = q;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;
        const weather = `
> 🌍 *𝐖ᴇᴀᴛʜᴇ𝐑 𝐈ɴꜰᴏʀᴍᴀᴛɪᴏ𝐍 𝐅ᴏ𝐑 ${data.name}, ${data.sys.country}* 🌍
> 🌡️ *𝚃𝙴𝙼𝙿𝙴𝚁𝙰𝚃𝚄𝚁𝙴*: ${data.main.temp}°C
> 🌡️ *𝙵𝙴𝙴𝙻𝚂 𝙻𝙸𝙺𝙴*: ${data.main.feels_like}°C
> 🌡️ *𝙼𝙸𝙽 𝚃𝙴𝙼𝙿*: ${data.main.temp_min}°C
> 🌡️ *𝙼𝙰𝚇 𝚃𝙴𝙼𝙿*: ${data.main.temp_max}°C
> 💧 *𝙷𝚄𝙼𝙸𝙳𝙸𝚃𝚈*: ${data.main.humidity}%
> ☁️ *𝚆𝙴𝙰𝚃𝙷𝙴𝚁*: ${data.weather[0].main}
> 🌫️ *𝙳𝙴𝚂𝙲𝚁𝙸𝙿𝚃𝙸𝙾𝙽*: ${data.weather[0].description}
> 💨 *𝚆𝙸𝙽𝙳 𝚂𝙿𝙴𝙴𝙳*: ${data.wind.speed} m/s
> 🔽 *𝙿𝚁𝙴𝚂𝚂𝚄𝚁𝙴*: ${data.main.pressure} hPa

> *© Powered By King-Sandesh-Md V2 💸*
`;
        return reply(weather);
    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 City not found. Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the weather information. Please try again later.");
    }
});
                 
