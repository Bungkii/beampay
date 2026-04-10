export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { amount, currency, paymentMethod } = req.body;
    const mid = process.env.BEAM_MID; // poonchayaresort-772ew4
    const apiKey = process.env.BEAM_API_KEY;

    // 🔒 สร้างรหัส Basic Auth ตามคู่มือ Beam (Base64 encoding of MerchantID:APIKey)
    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}` // ✅ ใช้ Basic Auth ตามคู่มือเป๊ะ
            },
            body: JSON.stringify({ 
                amount, 
                currency, 
                paymentMethod 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ 
                error: data.message || "Beam API Rejected",
                details: data 
            });
        }

        // ส่งข้อมูลกลับ พร้อม MID
        res.status(200).json({ ...data, mid });
    } catch (e) {
        res.status(500).json({ error: "Server Error: " + e.message });
    }
}
