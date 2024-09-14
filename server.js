const express = require("express");
const createPDF = require("./html2pdf");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Enable CORS for all routes
app.use(cors());

app.get("/download-pdf", async (req, res) => {
  try {
    const { url } = req.query;
    console.log(url);
    const stream = await createPDF(url);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while generating the PDF");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
