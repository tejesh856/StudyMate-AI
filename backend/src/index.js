// index.js
import http from 'http';
import { Server } from 'socket.io';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import createError from "http-errors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import quizRoutes from "./routes/quiz.route.js";
import learnRoutes from "./routes/learn.route.js";
import notificationRoutes from './routes/notification.route.js';
import { setupSocket } from './socket/index.js';
import connectDB from './config/db.js';
import { setSocketInstance } from './socket/globalsocket.js';
import { startEnrichCourseWorker } from './workers/enrichCourseWorker.js';
dotenv.config({ path: `${process.cwd()}/.env` });

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(express.json());
  app.use(cookieParser());

  await connectDB();
  startEnrichCourseWorker();

  app.use("/api/auth", authRoutes);
  app.use("/api/quiz", quizRoutes);
  app.use("/api/learn", learnRoutes);
  app.use("/api/notifications", notificationRoutes);


  // Not found handler
  app.use((req, res, next) => next(createError.NotFound()));

  // Error handler
  app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
      error: {
        status: err.status || 500,
        message: err.message,
      },
    });
  });

  // Setup Socket.IO logic
  setSocketInstance(io);
  setupSocket(io);

  server.listen(PORT, () => {
    console.log(`StudyMate AI Server is running on port ${PORT}`);
  });
};

startServer();
