import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// Enable CORS for the widget script
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

// Serve chattermate.min.js with proper headers
app.get("/chattermate.min.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(join(__dirname, "chattermate.min.js"));
});

// Serve index.html
app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.listen(port, () => {
  console.log(`Test server running at http://localhost:${port}`);
});
