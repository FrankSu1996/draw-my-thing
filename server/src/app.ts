import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { CORS } from "./config";

dotenv.config();

const app: Express = express();
app.use(cors(CORS));
const httpServer = createServer(app);

export { app, httpServer };
