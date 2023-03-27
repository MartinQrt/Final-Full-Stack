import { config } from "dotenv";
config();
import { connectToDb } from "./config/dbConfig";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

connectToDb();

const app = express();
const PORT = process.env.port || 5001;

app.use(cors(), express.json(), cookieParser());
app.use(router);

app.listen(PORT, () => console.log('Server is running on: ${PORT}'));