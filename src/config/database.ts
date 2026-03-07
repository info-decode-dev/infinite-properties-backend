import { PrismaClient } from "@prisma/client";

// Create a singleton Prisma client instance
// This ensures we reuse connections efficiently
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Parse DATABASE_URL to optimize connection pooling
const getOptimizedDatabaseUrl = (): string => {
  const dbUrl = process.env.DATABASE_URL || "";
  
  // If using Supabase with connection_limit=1, we need to handle it carefully
  // For better concurrency, consider using transaction mode pooler (port 6543)
  // or increasing connection_limit if your plan allows it
  
  // Check if it's a Supabase connection with pgbouncer
  if (dbUrl.includes("pgbouncer=true") && dbUrl.includes("connection_limit=1")) {
    console.warn(
      "⚠️  Using connection_limit=1 may cause connection pool exhaustion with concurrent requests.\n" +
      "💡 Consider using Supabase transaction mode pooler (port 6543) or increasing connection_limit."
    );
  }
  
  return dbUrl;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    // Configure connection pool settings
    datasources: {
      db: {
        url: getOptimizedDatabaseUrl(),
      },
    },
  });

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
