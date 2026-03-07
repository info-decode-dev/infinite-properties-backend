import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import path from "path";
import prisma from "./config/database";
import { errorHandler } from "./middleware/errorHandler";

// Import routes
import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import testimonialRoutes from "./routes/testimonialRoutes";
import collectionRoutes from "./routes/collectionRoutes";
import aboutUsRoutes from "./routes/aboutUsRoutes";
import enquiryRoutes from "./routes/enquiryRoutes";

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
// CORS configuration - allow multiple origins
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ["http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      // In development, allow localhost
      if (process.env.NODE_ENV === "development" && origin.includes("localhost")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(compression());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files with CORS headers
app.use("/uploads", (req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Access-Control-Allow-Origin", process.env.CORS_ORIGIN || "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
}, express.static(path.join(__dirname, "../public/uploads")));

// Root route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Infinite Properties API Server",
    version: "1.0.0",
    endpoints: {
      health: "/health",
      api: "/api",
    },
  });
});

// Health check
app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      success: true,
      message: "Server is running",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Health check database error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
      timestamp: new Date().toISOString(),
    });
  }
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/collections", collectionRoutes);
app.use("/api/about-us", aboutUsRoutes);
app.use("/api/enquiries", enquiryRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down gracefully...");
  await prisma.$disconnect();
  process.exit(0);
});

// Start server
const HOST = process.env.HOST || "0.0.0.0";
app.listen(PORT, HOST, () => {
  console.log(`Server is running on ${HOST}:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Database: PostgreSQL`);
});

export default app;
