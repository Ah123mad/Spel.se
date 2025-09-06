export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { query } = req.body || {};
    if (!query) return res.status(400).json({ error: "No query" });

    // Enkel plugin som söker på Wikipedia
    const r = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        query
      )}`
    );
    const data = await r.json();

    res.status(200).json({
      reply: data.extract || "Hittade inget på Wikipedia",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
