import cors from "cors";
import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import managerRoutes from "./routes/managerRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

const app = express();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message: "Too many authentication attempts. Please try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/manager", managerRoutes);
app.use("/api/notifications", notificationRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
