export default async function handler(req, res) {
    if (req.method === 'POST') {
        console.log("🔔 Webhook Received:", JSON.stringify(req.body, null, 2));
        // ข้อมูลนี้จะปรากฏในหน้า Logs ของ Vercel
        return res.status(200).json({ received: true });
    }
    res.status(405).end();
}