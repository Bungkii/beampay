export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { amount, currency, paymentMethod } = req.body;
    const mid = process.env.BEAM_MID;       // poonchayaresort-772ew4
    const apiKey = process.env.BEAM_API_KEY; // รหัสลับของคุณ

    // ทำ Basic Authentication ตามคู่มือ (Username:Password -> Base64)
    const authHeader = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${authHeader}` // ✅ แก้จาก Bearer เป็น Basic
            },
            body: JSON.stringify({ amount, currency, paymentMethod })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ 
                error: data.message || "Beam API Error",
                details: data 
            });
        }

        res.status(200).json({ ...data, mid });
    } catch (e) {
        res.status(500).json({ error: "Server Connection Error" });
    }
}
