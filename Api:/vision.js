import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });
    const file = files.image[0];
    const buffer = fs.readFileSync(file.filepath);

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        input: [
          { role: "user", content: "Beskriv den här bilden." },
          {
            role: "user",
            content: [{ type: "input_image", image_data: buffer.toString("base64") }],
          },
        ],
      }),
    });

    const data = await r.json();
    return res.status(200).json({ reply: data.output_text || "Inget svar" });
  });
}
