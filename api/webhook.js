export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    
    // บันทึก Log ลง Vercel เพื่อดูย้อนหลัง
    console.log("💰 [Beam Webhook Received]:", JSON.stringify(req.body, null, 2));

    if (req.body.event === 'charge.succeeded') {
        const { id, amount, referenceNo } = req.body.data;
        console.log(`✅ ชำระสำเร็จ! ID: ${id}, ยอด: ${amount} THB, Ref: ${referenceNo}`);
    }

    return res.status(200).json({ received: true });
}
