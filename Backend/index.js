import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

// Fix for SRV resolution issues on some local networks
dns.setServers(["8.8.8.8", "1.1.1.1"]);
import authRoute from "./routes/authRoute.js";
import courseRoute from "./routes/courseRoute.js";
import examRoute from "./routes/examRoute.js";
import connectDB from "./utils/db.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to database
connectDB();

// Routes
app.get("/", (req, res) => res.send("EduTrack API is running"));

app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/exam", examRoute);

app.listen(8000, () => console.log("Server running on port 8000"));
