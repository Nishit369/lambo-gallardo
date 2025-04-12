import mongoose from "mongoose";

const GeneratedImageSchema = new mongoose.Schema({
  prompt: {
    type: String,
    required: true,
  },
  image: {
    type: String, 
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const GeneratedImage = mongoose.model("GeneratedImage", GeneratedImageSchema);

export default GeneratedImage;