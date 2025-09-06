export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

  try {
    const { message } = req.body || {};
    // Snabbt “eko”-svar – bara för att verifiera att frontend ↔ backend funkar
    if (!message) return res.status(200).json({ reply: "Säg något! 😊" });
    return res.status(200).json({ reply: "Jag hör dig: " + message });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
