export default async function handler(req, res) {
    const { id } = req.query;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;

    if (!id) return res.status(400).json({ error: "No Charge ID" });

    // 🔒 ต้องใช้รหัส MerchantID:APIKey เข้ารหัส Base64 ตามคู่มือ
    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');

    try {
        const response = await fetch(`https://api.beamcheckout.com/api/v1/charges/${id}`, {
            method: "GET",
            headers: { 
                "Authorization": `Basic ${credentials}`,
                "Content-Type": "application/json"
            }
        });

        const data = await response.json();
        
        // บันทึกลง Log เพื่อให้พี่ไปเช็คใน Vercel ได้ว่า Beam ตอบว่าอะไร
        console.log(`🔍 Checking Charge ${id}: Status is ${data.status}`);

        res.status(200).json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
}
