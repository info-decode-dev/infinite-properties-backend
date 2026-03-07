import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/**
 * Retry a database operation if it fails due to connection pool exhaustion
 * @param operation The database operation to retry
 * @param maxRetries Maximum number of retries (default: 3)
 * @param delayMs Delay between retries in milliseconds (default: 500)
 */
export async function retryOnConnectionError<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 500
): Promise<T> {
  let lastError: Error | unknown;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: unknown) {
      lastError = error;
      
      // Check if it's a connection pool error
      const isConnectionError = 
        error instanceof Error &&
        (error.message?.includes("MaxClientsInSessionMode") ||
         error.message?.includes("max clients reached") ||
         error.message?.includes("connection pool") ||
         (error instanceof PrismaClientKnownRequestError && error.code === "P1001"));
      
      // If it's not a connection error or we've exhausted retries, throw
      if (!isConnectionError || attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = delayMs * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      console.warn(`Database connection retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`);
    }
  }
  
  throw lastError;
}
