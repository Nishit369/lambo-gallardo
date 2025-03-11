import express from 'express';
import * as dotenv from "dotenv";
import cors from 'cors';
import clipdropRoutes from './routes/clipdrop.routes.js';  // filename consistency

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

// ✅ Fixed route path
app.use('/api/v1/clipdrop', clipdropRoutes);

// ✅ Updated welcome route message
app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from ClipDrop Image Generator API" });
});

app.listen(8080, () => console.log("SERVER STARTED at http://localhost:8080"));