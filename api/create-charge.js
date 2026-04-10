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

        // 🔥 ถ้า Beam ปฏิเสธ (เช่น ยอดไม่ถึงขั้นต่ำ) ให้ส่ง Error กลับไปที่หน้าจอ
        if (!response.ok) {
            return res.status(response.status).json({ 
                error: data.message || "Beam API ปฏิเสธการสร้างรายการ", 
                details: data 
            });
        }

        res.status(200).json(data);
    } catch (e) { 
        res.status(500).json({ error: "Server Error: " + e.message }); 
    }
}
