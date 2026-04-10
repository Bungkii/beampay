export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { amount } = req.body;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;

    if (!mid || !apiKey) {
        return res.status(400).json({ error: "Missing MID or API Key in Vercel Environment Variables" });
    }

    // 🔒 สร้างรหัส Basic Auth
    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    // 🔑 สร้างเลขอ้างอิงสุ่ม (Reference Number) และ Idempotency Key
    const refNo = `REF${Date.now()}`;
    const idempotencyKey = `IDEM${Date.now()}`;

    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}`,
                "X-Beam-Idempotency-Key": idempotencyKey
            },
            body: JSON.stringify({ 
                amount: parseInt(amount),      // ✅ บังคับเป็นตัวเลขจำนวนเต็ม (Integer)
                currency: "THB",               // ✅ สกุลเงิน
                paymentMethod: "PROMPTPAY",    // ✅ ชื่อฟิลด์ตามที่ Error แจ้ง
                referenceNo: refNo,            // ✅ เพิ่มเลขอ้างอิง (ป้องกัน Malformed)
                description: "Poonchaya Resort Payment" // ✅ เพิ่มคำอธิบายรายการ
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // ส่ง Error ไปโชว์ที่หน้าจอ Sunmi เพื่อดูว่าติดที่ Field ไหน
            return res.status(400).json({ 
                error: data.message || "Beam API Validation Error",
                details: data 
            });
        }

        res.status(200).json({ ...data, mid });
    } catch (e) {
        res.status(500).json({ error: "Network Error: " + e.message });
    }
}
