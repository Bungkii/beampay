export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { amount } = req.body;
    const mid = process.env.BEAM_MID;
    const apiKey = process.env.BEAM_API_KEY;
    const credentials = Buffer.from(`${mid}:${apiKey}`).toString('base64');
    try {
        const response = await fetch("https://api.beamcheckout.com/api/v1/charges", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Basic ${credentials}` },
            body: JSON.stringify({ 
                amount: parseInt(amount), currency: "THB",
                paymentMethod: { qrPromptPay: { expiryTime: new Date(Date.now() + 10 * 60000).toISOString() }, paymentMethodType: "QR_PROMPT_PAY" },
                referenceId: `POS${Date.now()}`
            })
        });
        const data = await response.json();
        if (!response.ok) return res.status(400).json({ error: data.message });
        res.status(200).json({ chargeId: data.chargeId, encodedImage: data.encodedImage.imageBase64Encoded, mid: mid });
    } catch (e) { res.status(500).json({ error: e.message }); }
}
