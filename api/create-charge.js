export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { amount } = req.body;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;

    // 🔒 Basic Auth: Base64(MID:APIKey)
    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}`
            },
            // ✅ ปรับโครงสร้าง JSON ตามคู่มือ Beam API 2026
            body: JSON.stringify({ 
                amount: parseInt(amount), // หน่วยสตางค์
                currency: "THB",
                paymentMethod: {
                    qrPromptPay: {
                        // ตั้งหมดอายุไปอีก 5 นาที (ISO 8601 Format)
                        expiryTime: new Date(Date.now() + 5 * 60000).toISOString()
                    },
                    paymentMethodType: "QR_PROMPT_PAY"
                },
                referenceId: `POS_${Date.now()}`,
                returnUrl: `https://${req.headers.host}`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ error: data.message || "Beam API Error", details: data });
        }

        // ส่งข้อมูลกลับไปให้หน้าบ้าน (จะได้รับเป็น Base64 Image)
        res.status(200).json({ ...data, mid });

    } catch (e) {
        res.status(500).json({ error: "Server Error: " + e.message });
    }
}
