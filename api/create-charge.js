export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { amount, currency } = req.body;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;

    if (!mid || !apiKey) {
        return res.status(400).json({ error: "กรุณาตั้งค่า MID และ API Key ใน Vercel Environment Variables" });
    }

    // 🔒 สร้างรหัส Basic Auth
    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    // 🔑 สร้าง Idempotency Key
    const idempotencyKey = `key_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}`,
                "X-Beam-Idempotency-Key": idempotencyKey
            },
            body: JSON.stringify({ 
                amount: Number(amount),      // ✅ ต้องเป็นตัวเลขเท่านั้น
                currency: "THB",             // ✅ ต้องเป็นตัวใหญ่
                paymentMethod: "PROMPTPAY"   // ✅ เปลี่ยนกลับเป็น Camel Case ตามที่ Error แจ้ง
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ 
                error: data.message || "Beam API Validation Failed",
                details: data 
            });
        }

        res.status(200).json({ ...data, mid });
    } catch (e) {
        res.status(500).json({ error: "เชื่อมต่อ Beam ไม่สำเร็จ: " + e.message });
    }
}
