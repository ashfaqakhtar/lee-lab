import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";



// imported routes 
import authRoutes from "./routes/auth.routes.js";



// Load .env file from parent directory
dotenv.config({ path: "./.env" });


// dotenv.config();

console.log("Loaded PORT:", process.env.PORT); // debug log

const app = express();

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 8000;


app.get("/", (req, res) => {
  res.send("Server is running 🔥 welcome let's rock");
});

app.use("/api/v1/auth", authRoutes);



app.listen(PORT, () => {
  console.log(` Server is running on port ${PORT} ✅`);
});

