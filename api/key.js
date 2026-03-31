export default function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();
  res.status(200).json({ key: process.env.ANTHROPIC_API_KEY });
}
