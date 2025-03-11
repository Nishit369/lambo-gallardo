import express from "express";
import * as dotenv from "dotenv";
import axios from 'axios';

dotenv.config();

const router = express.Router();

router.route("/").get((req, res) => {
    res.status(200).json({ message: "hello from clipdrop routes" });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        const response = await axios.post(
            'https://clipdrop-api.co/text-to-image/v1',
            { prompt: prompt },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.CLIPDROP_API_KEY,  // Correct header for ClipDrop
                },
                responseType: 'arraybuffer' // Important for image buffer response
            }
        );

        // Convert binary data to base64 string
        const base64Image = Buffer.from(response.data, 'binary').toString('base64');

        // Return base64 image with the correct MIME type (assuming it's a PNG)
        res.status(200).json({
            photo: `data:image/png;base64,${base64Image}`
        });

    } catch (error) {
        console.error('Clipdrop API Error:', error.message);
        res.status(500).json({ message: "Something went wrong with ClipDrop API" });
    }
});

export default router;