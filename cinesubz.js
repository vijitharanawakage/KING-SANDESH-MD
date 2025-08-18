const puppeteer = require('puppeteer');

async function capturetokenandcookies(url) {
  let browser;
  try {
    browser = await puppeteer.launch({
        headless: 'new',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-gpu',
          '--no-zygote',
        ],
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
    );

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
      Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
      Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
      window.chrome = { runtime: {} };
    });

    await page.evaluateOnNewDocument(() => {
      const metas = document.getElementsByTagName('meta');
      for (let i = metas.length - 1; i >= 0; i--) {
        if (metas[i].httpEquiv && metas[i].httpEquiv.toLowerCase() === 'refresh') {
          metas[i].remove();
        }
      }
    });

    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const reqUrl = request.url();
      if (reqUrl.includes('disable-devtool') || reqUrl.includes('shoagloumtoamir.net')) {
        request.abort();
      } else {
        request.continue();
      }
    });

    let capturedRequest = null;
    page.on('request', (request) => {
      if (request.method() === 'POST' && !capturedRequest) {
        capturedRequest = {
          url: request.url(),
          headers: request.headers(),
          body: request.postData(),
        };
      }
    });

    await page.goto(url, { waitUntil: 'load', timeout: 60000 });

    const buttons = ['#pixelCopy', '#gdriveButton', '#gdriveButton2'];
    for (const selector of buttons) {
      try {
        await page.waitForSelector(selector, { timeout: 8000 });
        await Promise.all([
          page.waitForNetworkIdle(),
          page.click(selector),
        ]);
        await page.waitForTimeout(3000);
        if (capturedRequest) break;
      } catch {}
    }

    if (!capturedRequest) {
      await browser.close();
      return [];
    }

    let token = null;
    try {
      const bodyJson = JSON.parse(capturedRequest.body);
      token = bodyJson.token || null;
    } catch {}

    const cookies = capturedRequest.headers.cookie || null;

    await browser.close();

    return { token, cookies };
  } catch (e) {
    if (browser) await browser.close();
    return [];
  }
}

module.exports = { capturetokenandcookies };
