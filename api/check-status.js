export default async function handler(req, res) {
    const { id } = req.query;
    try {
        const response = await fetch(`https://api.beamcheckout.com/api/v1/charges/${id}`, {
            headers: { "Authorization": `Bearer ${process.env.BEAM_API_KEY}` }
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
}