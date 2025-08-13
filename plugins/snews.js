const axios = require("axios");
const cheerio = require("cheerio");
const { cmd } = require("../command");
const config = require("../config");

const isButton = process.env.BUTTON === "true";
const AUTO_NEWS_ENABLED = process.env.AUTO_NEWS === "true";

// User auto news status storage (in-memory, restart will reset)
const userAutoNewsStatus = new Set(); // numbers with auto news ON

const formatSinhalaDate = () => {
  const months = [
    "ජනවාරි", "පෙබරවාරි", "මාර්තු", "අප්‍රේල්", "මැයි", "ජූනි",
    "ජූලි", "අගෝස්තු", "සැප්තැම්බර්", "ඔක්තෝබර්", "නොවැම්බර්", "දෙසැම්බර්"
  ];
  const now = new Date();
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  const hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${year} ${month} ${day}, ${hours}:${minutes}`;
};

// Sirasa News Headlines & Article
async function getSirasaNews() {
  const res = await axios.get("https://sinhala.newsfirst.lk/latest-news");
  const $ = cheerio.load(res.data);
  const articles = [];

  $("ul.news-list li").each((i, el) => {
    const title = $(el).find(".ntitle a").text().trim();
    const url = $(el).find(".ntitle a").attr("href");
    const img = $(el).find("img").attr("src");
    const time = formatSinhalaDate();
    if (title && url) articles.push({ title, url, img, time });
  });
  return articles;
}
async function getSirasaArticle(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    let summary = $(".article-content p").first().text().trim() || "";
    let video = $("iframe").attr("src") || "";
    const images = [];
    $(".article-content img").each((i, el) => {
      let src = $(el).attr("src");
      if (src && !images.includes(src)) images.push(src);
    });
    return { summary, video, images };
  } catch {
    return { summary: "", video: "", images: [] };
  }
}

// Hiru News Headlines & Article
async function getHiruNews() {
  const res = await axios.get("https://www.hirunews.lk/sinhala");
  const $ = cheerio.load(res.data);
  const articles = [];
  $("div.homelist-block").each((i, el) => {
    const title = $(el).find("a").text().trim();
    const url = "https://www.hirunews.lk" + $(el).find("a").attr("href");
    const img = $(el).find("img").attr("src");
    const time = formatSinhalaDate();
    if (title && url) articles.push({ title, url, img, time });
  });
  return articles;
}
async function getHiruArticle(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    let summary = $(".article-content p").first().text().trim() || "";
    let video = $("iframe").attr("src") || "";
    const images = [];
    $(".article-content img").each((i, el) => {
      let src = $(el).attr("src");
      if (src && !images.includes(src)) images.push(src);
    });
    return { summary, video, images };
  } catch {
    return { summary: "", video: "", images: [] };
  }
}

// Derana News Headlines & Article
async function getDeranaNews() {
  const res = await axios.get("https://sinhala.adaderana.lk");
  const $ = cheerio.load(res.data);
  const articles = [];
  $("div.span3").each((i, el) => {
    const title = $(el).find("a").text().trim();
    const url = "https://sinhala.adaderana.lk" + $(el).find("a").attr("href");
    const img = $(el).find("img").attr("src");
    const time = formatSinhalaDate();
    if (title && url) articles.push({ title, url, img, time });
  });
  return articles;
}
async function getDeranaArticle(url) {
  try {
    const res = await axios.get(url);
    const $ = cheerio.load(res.data);
    let summary = $(".article-content p").first().text().trim() || "";
    let video = $("iframe").attr("src") || "";
    const images = [];
    $(".article-content img").each((i, el) => {
      let src = $(el).attr("src");
      if (src && !images.includes(src)) images.push(src);
    });
    return { summary, video, images };
  } catch {
    return { summary: "", video: "", images: [] };
  }
}

// Fetch latest news by source name
async function fetchLatestNews(source) {
  if (source === "sirasa") return await getSirasaNews();
  if (source === "hiru") return await getHiruNews();
  if (source === "derana") return await getDeranaNews();
  return [];
}
// Fetch full article by source name
async function fetchFullArticle(source, url) {
  if (source === "sirasa") return await getSirasaArticle(url);
  if (source === "hiru") return await getHiruArticle(url);
  if (source === "derana") return await getDeranaArticle(url);
  return { summary: "", video: "", images: [] };
}

// Store last news headlines for auto news to avoid repeats
const lastNewsCache = {
  sirasa: [],
  hiru: [],
  derana: []
};

// Auto news checker
async function checkAutoNews(conn, userNumber) {
  if (!AUTO_NEWS_ENABLED) return;

  const sources = ["sirasa", "hiru", "derana"];

  for (const source of sources) {
    try {
      const latest = await fetchLatestNews(source);
      const oldTitles = lastNewsCache[source].map(n => n.title);

      const newArticles = latest.filter(n => !oldTitles.includes(n.title));
      if (newArticles.length > 0) {
        lastNewsCache[source] = latest; // update cache

        for (const article of newArticles) {
          const details = await fetchFullArticle(source, article.url);
          let msg = `🆕 *_NEW LATEST ${source.toUpperCase()} NEWS DETECTED_*\n\n📰 *${article.title}*\n\n`;
          if (details.summary) msg += `📄 _${details.summary}_\n\n`;
          msg += `🔗 ${article.url}\n🕒 ${article.time}`;

          // Send only if user enabled auto news
          if (userAutoNewsStatus.has(userNumber)) {
            await conn.sendMessage(userNumber, {
              image: { url: article.img || config.THUMB_IMAGE },
              caption: msg
            });
          }
        }
      }
    } catch (e) {
      console.error("Auto news check error:", e);
    }
  }
}

// Start auto news polling every X minutes
function startAutoNewsPolling(conn) {
  if (!AUTO_NEWS_ENABLED) return;

  const autoNewsNumber = config.AUTO_NEWS_NUMBER; // Add this in your config.js (string number with country code)

  if (!autoNewsNumber) {
    console.error("AUTO_NEWS_NUMBER is not set in config.js");
    return;
  }

  // Initial fetch to fill cache
  (async () => {
    for (const src of ["sirasa", "hiru", "derana"]) {
      lastNewsCache[src] = await fetchLatestNews(src);
    }
  })();

  setInterval(() => {
    checkAutoNews(conn, autoNewsNumber);
  }, 10 * 60 * 1000); // every 10 minutes (adjust as needed)
}

// Commands to toggle auto news for user

cmd({
  pattern: "autonews",
  desc: "Toggle Auto News mode ON/OFF for yourself",
  category: "news",
  react: "📰",
  filename: __filename,
}, async (conn, m, msg, { args, reply, from, sender }) => {
  if (!AUTO_NEWS_ENABLED) return reply("⚠️ Auto news mode is disabled in config.");

  if (!args[0]) return reply("💉 Usage: .autonews on / off");

  const cmd = args[0].toLowerCase();
  if (cmd === "on") {
    userAutoNewsStatus.add(sender);
    reply("✅ 𝐀ᴜᴛᴏ 𝐍ᴇᴡꜱ 𝐌ᴏᴅᴇ 𝐈ꜱ *_𝐎𝐍_* 𝐅ᴏʀ 𝐘ᴏᴜ. 𝐘ᴏᴜ 𝐖ɪʟʟ 𝐑ᴇᴄᴇɪᴠᴇ 𝐍ᴇᴡ 𝐍ᴇᴡꜱ 𝐀ᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ.");
  } else if (cmd === "off") {
    userAutoNewsStatus.delete(sender);
    reply("❌ 𝐀ᴜᴛᴏ 𝐍ᴇᴡꜱ 𝐌ᴏᴅᴇ 𝐈ꜱ *_𝐎𝐅𝐅_* 𝐅ᴏʀ 𝐘ᴏᴜ. 𝐘ᴏᴜ 𝐖ɪʟʟ 𝐍ᴏ 𝐋ᴏɴɢᴇʀ 𝐑ᴇᴄᴇɪᴠᴇ 𝐍ᴇᴡ 𝐍ᴇᴡꜱ 𝐀ᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ.");
  } else {
    reply("💉 Usage: .autonews on / off");
  }
});

// Existing snews command unchanged but included here

cmd({
  pattern: "snews",
  desc: "📢 Sinhala News (Sirasa, Hiru, Derana) with Full Details",
  category: "news",
  react: "📰",
  filename: __filename,
}, async (conn, m, msg, { args, reply, from }) => {
  let source = args[0]?.toLowerCase();

  if (!source) {
    if (isButton) {
      return await conn.sendMessage(from, {
        text: "📺 *𝐒ᴇʟᴇᴄ𝐓 𝐍ᴇᴡ𝐒 𝐒ᴏᴜʀᴄ𝐄*",
        buttons: [
          { buttonId: ".snews sirasa", buttonText: { displayText: "♠ 𝚂𝙸𝚁𝙰𝚂𝙰 𝙽𝙴𝚆𝚂" }, type: 1 },
          { buttonId: ".snews hiru", buttonText: { displayText: "♠ 𝙷𝙸𝚁𝚄 𝙽𝙴𝚆𝚂" }, type: 1 },
          { buttonId: ".snews derana", buttonText: { displayText: "♠ 𝙳𝙴𝚁𝙰𝙽𝙰 𝙽𝙴𝚆𝚂" }, type: 1 }
        ],
        footer: "📎 𝐊ꜱᴍ𝐃 𝐍ᴇᴡ𝐒 𝐒ʏꜱᴛᴇ𝐌",
        headerType: 1
      }, { quoted: m });
    } else {
      return await reply(
        `📺 *𝐒ᴇʟᴇᴄ𝐓 𝐍ᴇᴡ𝐒 𝐒ᴏᴜʀᴄ𝐄:*\n\n♠ 𝚂𝙸𝚁𝙰𝚂𝙰\n♠ 𝙷𝙸𝚁𝚄\n♠ 𝙳𝙴𝚁𝙰𝙽𝙰\n\n👉 Example: .snews hiru`
      );
    }
  }

  let articles = [];
  if (source === "sirasa") articles = await getSirasaNews();
  else if (source === "hiru") articles = await getHiruNews();
  else if (source === "derana") articles = await getDeranaNews();
  else return await reply("❌ Invalid source. Use: sirasa / hiru / derana");

  const newsList = articles.slice(0, 10);

  for (let article of newsList) {
    let details = { summary: "", video: "", images: [] };
    if (source === "sirasa") details = await getSirasaArticle(article.url);
    else if (source === "hiru") details = await getHiruArticle(article.url);
    else if (source === "derana") details = await getDeranaArticle(article.url);

    let caption = `📰 *${article.title}*\n\n🕒 *${article.time}*\n\n`;
    if (details.summary) caption += `📄 _${details.summary}_\n\n`;
    caption += `🔗 ${article.url}`;

    let buttons = [
      { buttonId: article.url, buttonText: { displayText: "┉ 𝚁𝙴𝙰𝙳 𝙼𝙾𝚁𝙴" }, type: 1 },
      { buttonId: `.status ${article.url}`, buttonText: { displayText: "🟢 𝚂𝙷𝙰𝚁𝙴 𝚃𝙾 𝚂𝚃𝙰𝚃𝚄𝚂" }, type: 1 },
      { buttonId: `.forward ${article.url}`, buttonText: { displayText: "📤 𝙵𝙾𝚁𝚆𝙰𝚁𝙳" }, type: 1 }
    ];

    await conn.sendMessage(from, {
      image: { url: article.img || config.THUMB_IMAGE },
      caption,
      footer: "𝐒ʜᴀʀᴇ 𝐓ᴏ 𝐒ᴛᴀᴛᴜꜱ 𝐎ʀ 𝐅ᴏʀᴡᴀʀᴅ ⬇️",
      buttons,
      headerType: 4
    }, { quoted: m });
  }
});

// Export a function to start auto news polling (call this from your bot main file)
module.exports = {
  startAutoNewsPolling,
};
