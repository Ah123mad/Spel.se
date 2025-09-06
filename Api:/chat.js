export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });
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
        input: [{ role: "user", content: message }],
        stream: true,
      }),
    });

    if (!r.ok) {
      const err = await r.json();
      return res
        .status(500)
        .json({ error: err.error?.message || "OpenAI error" });
    }

    res.writeHead(200, {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    });

    const reader = r.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(decoder.decode(value));
    }
    res.end();
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
