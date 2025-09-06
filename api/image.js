export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  try {
    const { prompt } = req.body || {};
    if (!prompt) return res.status(400).json({ error: "No prompt" });

    const r = await fetch("https://api.openai.com/v1/images", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ model: "gpt-image-1", prompt, size: "512x512" }),
    });

    const data = await r.json();
    res.status(200).json({ url: data.data[0].url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
