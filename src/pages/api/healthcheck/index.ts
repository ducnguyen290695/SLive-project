
export default function handler(req, res) {
    res.status(200).json({ status: true, base_url_endpoint: process.env.API_URL })
}