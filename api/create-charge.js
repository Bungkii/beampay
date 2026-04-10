export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { amount, currency, paymentMethod } = req.body;
    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.BEAM_API_KEY}`
            },
            body: JSON.stringify({ amount, currency, paymentMethod })
        });
        const data = await response.json();
        res.status(200).json(data);
    } catch (e) { res.status(500).json({ error: e.message }); }
}