export default async function handler(req, res) {
    const { id } = req.query;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;

    if (!id) return res.status(400).json({ error: "Missing ID" });

    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    try {
        const response = await fetch(`https://api.beamcheckout.com/api/v1/charges/${id}`, {
            method: "GET",
            headers: { "Authorization": `Basic ${credentials}` }
        });

        const data = await response.json();
        // ส่งสถานะกลับไป (SUCCEEDED, PENDING, FAILED)
        res.status(200).json({ status: data.status, id: data.chargeId });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
