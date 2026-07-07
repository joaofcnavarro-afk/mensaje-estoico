import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize Gemini SDK with User-Agent telemetry headers as per rules
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

app.use(express.json());

// API: Generate a personalized Stoic message using gemini-3.5-flash server-side
app.post("/api/generate-message", async (req, res) => {
  try {
    const { nombre, tema, filosofo, semilla } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: "El nombre es obligatorio." });
    }

    const filósofosDisponibles = ["Marco Aurelio", "Séneca", "Epicteto", "Musonio Rufo", "Cleantes"];
    const filósofoElegido = filosofo || filósofosDisponibles[Math.floor(Math.random() * filósofosDisponibles.length)];
    const temaElegido = tema || "la vida, el destino y la aceptación de lo incontrolable";
    const semillaUnica = semilla || Math.floor(Math.random() * 100000);

    const prompt = `Escribe un mensaje estoico único e irrepetible en español, dirigido a ${nombre}, sobre ${temaElegido}.
Adopta la voz y el estilo de ${filósofoElegido}, como una carta breve, íntima, personal y profunda.
El mensaje debe tener entre 80 y 130 palabras. El tono debe ser sereno, directo, poético y filosófico, sin clichés modernos ni palabras en inglés.
Empieza dirigiéndose a ${nombre} por su nombre de manera natural (por ejemplo: "Marc, escucha:" o "Detente un instante, Marc..."). No uses Markdown, asteriscos ni comillas en el texto principal.
IMPORTANTE: Está estrictamente prohibido citar literalmente o parafrasear pasajes, aforismos o frases célebres de los estoicos tradicionales. Debes crear una reflexión y pensamiento totalmente original, inédito y nuevo, transmitiendo el espíritu de ${filósofoElegido} pero con palabras e imágenes de hoy en día, como si estuviera escribiendo esta carta hoy para ${nombre}.
Semilla de unicidad: ${semillaUnica} (no menciones este número en el texto).
Responde STRICTLY con el texto de la carta solamente. No incluyas firmas, introducciones, ni comentarios de tu parte.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const texto = response.text?.trim() || "No se pudo generar el texto.";

    res.json({
      texto,
      firma: `— ${filósofoElegido}`,
    });
  } catch (error: any) {
    console.error("Error generating Gemini message:", error);
    res.status(500).json({ error: "Error al generar el mensaje con inteligencia artificial." });
  }
});

// Configure Vite or Static production serving
async function setupViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite HMR middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }
}

setupViteOrStatic().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
