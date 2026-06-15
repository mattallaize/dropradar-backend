const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY manquante dans les variables d'environnement !");
  process.exit(1);
}

app.use(cors()); // autorise toutes les origines (frontend)
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "DropRadar backend OK 🚀" });
});

// Proxy vers l'API Anthropic
app.post("/api/claude", async (req, res) => {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("Erreur proxy:", err);
    res.status(500).json({ error: { message: "Erreur serveur : " + err.message } });
  }
});

app.listen(PORT, () => {
  console.log(`✅ DropRadar backend démarré sur le port ${PORT}`);
});
