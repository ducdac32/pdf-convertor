const express = require("express");
const pdfStreamResponse = require("./html2pdf");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

// Enable CORS for all routes
app.use(cors());

app.use((req, res, next) => {
  const userAgent = req.get('User-Agent') || '';

  const botKeywords = [
    'bot',
    'crawl',
    'spider',
    'slurp',
    'bingbot',
    'googlebot',
    'duckduckbot',
    'baiduspider',
    'yandexbot',
    'screamingfrog',
    'semrushbot',
    'ahrefsbot',
    'mj12bot',
    'facebookexternalhit',
    'linkedinbot',
    'twitterbot'
  ];

  if (botKeywords.some((keyword) => userAgent.toLowerCase().includes(keyword))) {
    console.log(`Blocked bot: ${userAgent}`);
    return res.status(403).send('Bots are not allowed');
  }

  next();
});


app.get("/download-pdf", async (req, res) => {
  try {
    const { url } = req.query;
    console.log(url);
    await pdfStreamResponse(url, res);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
