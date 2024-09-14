const puppeteer = require("puppeteer");
const PUPPETEER_ARGS = [
  "--autoplay-policy=user-gesture-required",
  "--disable-background-networking",
  "--disable-backgrounding-occluded-windows",
  "--disable-breakpad",
  "--disable-client-side-phishing-detection",
  "--disable-component-update",
  "--disable-default-apps",
  "--disable-dev-shm-usage",
  "--disable-domain-reliability",
  "--disable-extensions",
  "--disable-features=AudioServiceOutOfProcess",
  "--disable-hang-monitor",
  "--disable-ipc-flooding-protection",
  "--disable-notifications",
  "--disable-offer-store-unmasked-wallet-cards",
  "--disable-popup-blocking",
  "--disable-print-preview",
  "--disable-prompt-on-repost",
  "--disable-renderer-backgrounding",
  "--disable-setuid-sandbox",
  "--disable-speech-api",
  "--disable-sync",
  "--hide-scrollbars",
  "--ignore-gpu-blacklist",
  "--metrics-recording-only",
  "--mute-audio",
  "--no-default-browser-check",
  "--no-first-run",
  "--no-pings",
  "--no-sandbox",
  "--no-zygote",
  "--password-store=basic",
  "--use-gl=swiftshader",
  "--use-mock-keychain",
];

const PAPERWORK_PDF_OPTIONS = {
  scale: 0.95,
  format: "A4",
  margin: {
    top: 30,
    right: 0,
    bottom: 0,
    left: 0,
  },
  printBackground: true,
  pageRanges: "2-",
};

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const pdfStreamResponse = async (url = "https://www.google.com/", response) => {
  const browser = await puppeteer.launch({
    userDataDir: "cache",
    headless: "new",
    args: PUPPETEER_ARGS,
  });

  const page = await browser.newPage();

  try {
    await page.goto(url);

    await page.evaluate(() => {
      window.scrollBy(0, window.innerHeight); // Scroll down by one viewport height
    });

    await sleep(1000);

    await page.evaluate(() => {
      function canvasToImage(element) {
        const dataUrl = element.toDataURL();
        const image = document.createElement("img");
        image.src = dataUrl;

        const properties = ["width", "height", "position", "left", "top"];
        properties.forEach((key) => (image.style[key] = element.style[key]));
        image.className = element.className;

        element.parentNode && element.parentNode.insertBefore(image, element);
        element.parentNode && element.parentNode.removeChild(element);
      }

      [].forEach.call(document.getElementsByTagName("canvas"), canvasToImage);
    });

    const stream = await page.createPDFStream(PAPERWORK_PDF_OPTIONS);

    const reader = stream.getReader();

    response.setHeader("Content-Type", "application/pdf");

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        response.end();
        break;
      }

      response.write(value);
    }
  } catch (error) {
    await page.close();
    await browser.close();
  } finally {
    await page.close();
    await browser.close();
  }
};

module.exports = pdfStreamResponse;
