export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    // 1. ตรวจสอบข้อมูลที่รับมาจากหน้าบ้าน
    const { amount, currency, paymentMethod } = req.body;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;

    if (!amount || !mid || !apiKey) {
        return res.status(400).json({ error: "ข้อมูล MID หรือ API Key ใน Environment Variables ไม่ครบ" });
    }

    // 2. สร้างรหัส Basic Auth (Base64)
    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    // 3. สร้าง Idempotency Key (รหัสสุ่มไม่ให้ทำรายการซ้ำ)
    const idempotencyKey = `key_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Basic ${credentials}`,
                "X-Beam-Idempotency-Key": idempotencyKey // ✅ เพิ่มตามมาตรฐาน Beam
            },
            body: JSON.stringify({ 
                amount: Number(amount), // ✅ บังคับให้เป็นตัวเลข (Integer)
                currency: "THB",
                payment_method: "PROMPTPAY" // ✅ ลองเปลี่ยนเป็น payment_method (Snake Case) ตามมาตรฐานใหม่
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Beam Error Details:", data); // ดูใน Vercel Logs จะเห็นละเอียดมาก
            return res.status(400).json({ 
                error: data.message || "Beam ปฏิเสธรายการ (Bad Request)",
                beam_details: data 
            });
        }

        res.status(200).json({ ...data, mid });
    } catch (e) {
        res.status(500).json({ error: "เชื่อมต่อ Beam ไม่สำเร็จ: " + e.message });
    }
}
