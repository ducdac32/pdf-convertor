const { join } = require("path");

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Changes the cache location for Puppeteer.
  cacheDirectory:
    process.env.PUPPETEER_CACHE_DIR || join(__dirname, ".cache", "puppeteer"),
  chrome: {
    skipDownload: false,
  },
  // Download Firefox (default `skipDownload: true`).
  firefox: {
    skipDownload: true,
  },
};
