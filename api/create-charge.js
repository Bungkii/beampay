export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    const { amount, currency, paymentMethod } = req.body;
    const apiKey = process.env.BEAM_API_KEY;
    const mid = process.env.BEAM_MID; // ดึง MID จาก Environment Variable

    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            // เพิ่ม merchantId เข้าไปใน Body เพื่อยืนยันตัวตนกับ Beam ให้ชัดเจน
            body: JSON.stringify({ 
                amount, 
                currency, 
                paymentMethod,
                merchantId: mid 
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(400).json({ 
                error: data.message || "Beam ปฏิเสธรายการ",
                details: data 
            });
        }

        // ส่งข้อมูลสำเร็จกลับไป พร้อมแนบ MID ไปโชว์หน้าบ้านด้วย
        res.status(200).json({ ...data, mid });
    } catch (e) {
        res.status(500).json({ error: "Server Error: " + e.message });
    }
}
