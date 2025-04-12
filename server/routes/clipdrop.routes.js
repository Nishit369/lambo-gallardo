import express from "express";
import * as dotenv from "dotenv";
import axios from "axios";
import GeneratedImage from "../models/GeneratedImage.js"; 

dotenv.config();

const router = express.Router();

// GET Route 
router.route("/").get((req, res) => {
  console.log("GET request received at /clipdrop");
  res.status(200).json({ message: "hello from clipdrop routes" });
});

// POST Route 
router.route("/").post(async (req, res) => {
  console.log("POST request received at /clipdrop");

  try {
    const { prompt } = req.body;
    console.log("Received prompt:", prompt);

    const response = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      { prompt },
      {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.CLIPDROP_API_KEY,
        },
        responseType: "arraybuffer",
      }
    );

    console.log("API call to ClipDrop successful");

    const base64Image = Buffer.from(response.data, "binary").toString("base64");
    const imageData = `data:image/png;base64,${base64Image}`;
    console.log("Image converted to base64");

    const newImage = new GeneratedImage({
      prompt: prompt,
      image: imageData,
    });

    await newImage.save(); 
    console.log("Image and prompt saved to MongoDB");
    res.status(200).json({
      photo: imageData,
      message: "Image generated and saved successfully",
    });

  } catch (error) {
    console.error("Clipdrop API Error:", error.message);
    res.status(500).json({ message: "Something went wrong with ClipDrop API" });
  }
});

router.route('/all').get(async (req, res) => {
    try {
        const images = await GeneratedImage.find().sort({ createdAt: -1 }); 
        res.status(200).json(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ message: 'Failed to fetch images' });
    }
});

export default router;