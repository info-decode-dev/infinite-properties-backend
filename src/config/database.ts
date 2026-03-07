import { PrismaClient } from "@prisma/client";

// Create a singleton Prisma client instance
// This ensures we reuse connections efficiently
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Parse DATABASE_URL to optimize connection pooling
const getOptimizedDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || "";
  
  if (!dbUrl) {
    console.error("❌ DATABASE_URL is not set!");
    return "";
  }
  
  // Check if using transaction mode pooler (port 6543)
  if (dbUrl.includes(":6543") || dbUrl.includes("pooler.supabase.com")) {
    console.log("✅ Using Supabase Transaction Mode Pooler (port 6543)");
    
    // Transaction mode pooler doesn't need pgbouncer=true or connection_limit
    // Remove those parameters if present
    let optimizedUrl = dbUrl;
    if (optimizedUrl.includes("pgbouncer=true")) {
      optimizedUrl = optimizedUrl.replace(/[?&]pgbouncer=true/g, "");
      console.log("ℹ️  Removed pgbouncer=true (not needed for transaction mode)");
    }
    if (optimizedUrl.includes("connection_limit=")) {
      optimizedUrl = optimizedUrl.replace(/[?&]connection_limit=\d+/g, "");
      console.log("ℹ️  Removed connection_limit (not needed for transaction mode)");
    }
    
    // Clean up any double ? or &
    optimizedUrl = optimizedUrl.replace(/\?&/g, "?").replace(/&&/g, "&");
    if (optimizedUrl.endsWith("?") || optimizedUrl.endsWith("&")) {
      optimizedUrl = optimizedUrl.slice(0, -1);
    }
    
    return optimizedUrl;
  }
  
  // Check if it's a Supabase connection with pgbouncer (port 5432)
  if (dbUrl.includes("pgbouncer=true") && dbUrl.includes("connection_limit=1")) {
    console.warn(
      "⚠️  Using connection_limit=1 may cause connection pool exhaustion with concurrent requests.\n" +
      "💡 Consider using Supabase transaction mode pooler (port 6543) for better concurrency."
    );
  }
  
  return dbUrl;
};

// Initialize Prisma client with error handling
const dbUrl = getOptimizedDatabaseUrl();

if (!dbUrl) {
  console.error("❌ DATABASE_URL is empty or invalid!");
  console.error("💡 Please set DATABASE_URL in your Railway environment variables");
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Configure connection pool settings
    datasources: {
      db: {
        url: dbUrl || process.env.DATABASE_URL || "",
      },
    },
  });

// Test connection on startup (non-blocking)
if (dbUrl) {
  prisma.$connect()
    .then(() => {
      console.log("✅ Database connection established");
      console.log(`📊 Connection URL: ${dbUrl.replace(/:[^:@]+@/, ":****@")}`); // Hide password in logs
    })
    .catch((error: any) => {
      console.error("❌ Failed to connect to database");
      console.error("Error message:", error.message);
      console.error("Error code:", error.code);
      
      // Provide specific guidance based on error
      if (error.code === "P1001") {
        console.error("💡 Cannot reach database server. Check:");
        console.error("   - Database is active in Supabase Dashboard");
        console.error("   - Network connectivity from Railway");
        console.error("   - Host and port in DATABASE_URL are correct");
      } else if (error.message?.includes("password") || error.message?.includes("authentication")) {
        console.error("💡 Authentication failed. Check:");
        console.error("   - Password in DATABASE_URL is correct");
        console.error("   - Username includes project ref: postgres.ajcrudkaxzopexibomyz");
        console.error("   - Password doesn't need URL encoding");
      } else if (error.message?.includes("timeout")) {
        console.error("💡 Connection timeout. Check:");
        console.error("   - Database is not paused in Supabase");
        console.error("   - Network connectivity");
        console.error("   - Try increasing pool_timeout in connection string");
      } else {
        console.error("💡 Check your DATABASE_URL in Railway environment variables");
        console.error("💡 Verify the connection string format for port 6543");
        console.error("💡 Full error:", error);
      }
      // Don't throw - let the server start and handle errors per request
    });
} else {
  console.warn("⚠️  Prisma client initialized without DATABASE_URL - database operations will fail");
}

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Handle graceful shutdown
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect();
  } catch (error) {
    console.error("Error disconnecting Prisma:", error);
  }
};

process.on("beforeExit", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

// Handle connection errors and retry logic
prisma.$on("error" as never, (e: any) => {
  console.error("Prisma error:", e);
});

export default prisma;
