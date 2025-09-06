export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!process.env.OPENAI_API_KEY) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

  try {
    const { message } = req.body || {};
    if (!message) return res.status(400).json({ error: "No message" });

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        input: [{ role: "user", content: message }]
      }),
    });

    const data = await r.json();
    if (!r.ok) return res.status(500).json({ error: data.error?.message || "OpenAI error" });

    return res.status(200).json({ reply: data.output_text || "Inget svar" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
