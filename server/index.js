import express from 'express';
import * as dotenv from "dotenv";
import cors from 'cors';
import clipdropRoutes from './routes/clipdrop.routes.js';  
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));


app.use('/api/v1/clipdrop', clipdropRoutes);

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
.catch((err) => console.error("MongoDB Connection Error:", err));


app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from ClipDrop Image Generator API" });
});

app.listen(8080, () => console.log("SERVER STARTED "));