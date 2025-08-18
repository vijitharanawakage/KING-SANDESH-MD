const puppeteer = require("puppeteer");

async function capturetokenandcookies(url) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "networkidle2" });

    // ✅ grab cookies
    const cookies = (await page.cookies())
        .map(c => `${c.name}=${c.value}`)
        .join("; ");

    // ✅ extract token (from page script variable)
    const token = await page.evaluate(() => {
        let scripts = [...document.querySelectorAll("script")];
        let t = null;
        scripts.forEach(s => {
            if (s.innerText.includes("doo_player_ajax")) {
                let match = s.innerText.match(/"token":"(.*?)"/);
                if (match) t = match[1];
            }
        });
        return t;
    });

    await browser.close();
    return { token, cookies };
}

module.exports = { capturetokenandcookies };
