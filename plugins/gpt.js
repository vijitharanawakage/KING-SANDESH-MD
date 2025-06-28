import config from '../../config.cjs';
import axios from 'axios';

const gpt = async (m, sock) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(' ')[0].toLowerCase() : '';
  const text = m.body.slice(prefix.length + cmd.length).trim();

  if (cmd === "gpt") {
    if (!text) {
      return sock.sendMessage(m.from, { text: `Please provide a query for GPT.\n\nExample: ${prefix}gpt What is the capital of Sri Lanka..?` }, { quoted: m });
    }

    const start = new Date().getTime();
    await m.React('⏳'); // Show processing indicator

    try {
      console.log("Fetching response from GPT API...");
      const apiUrl = `https://api.giftedtech.web.id/api/ai/gpt4?apikey=gifted&q=${encodeURIComponent(text)}`;
      console.log("GPT API URL:", apiUrl);
      const response = await axios.get(apiUrl);
      console.log("GPT API Response Status:", response.status);

      if (response.status !== 200) {
        const errorText = response.data.error || "Unknown error";
        throw new Error(`GPT API request failed: ${response.status} - ${errorText}`);
      }

      const data = response.data;
      console.log("GPT API Data:", data);

      if (data && data.result) {
        const end = new Date().getTime();
        const responseTime = (end - start) / 1000;
        const replyText = `${data.result}\n\n*Response Time: ${responseTime.toFixed(2)} s*\n\nPowered by King-Sandesh-Md;
        await sock.sendMessage(m.from, { text: replyText }, { quoted: m });
      } else {
        console.log("Invalid GPT API response structure");
        await sock.sendMessage(m.from, { text: `⚠️ Invalid response from GPT API.` }, { quoted: m });
      }
    } catch (error) {
      console.error("Error fetching from GPT API:", error);
      const end = new Date().getTime();
      const responseTime = (end - start) / 1000;
      await sock.sendMessage(m.from, { text: `❌ Error fetching GPT response:\n${error.message}\n\n*Error Time: ${responseTime.toFixed(2)} s*` }, { quoted: m });
    } finally {
      await m.React('✅'); // Show completion indicator (or error)
    }
  }
};

export default gpt;
