export default async function handler(req, res) {
    const { id } = req.query;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;
    const authHeader = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    try {
        const response = await fetch(`https://api.beamcheckout.com/api/v1/charges/${id}`, {
            headers: {
                "Authorization": `Basic ${authHeader}` // ✅ แก้เป็น Basic
            }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
