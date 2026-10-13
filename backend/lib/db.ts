import { PrismaClient } from "@prisma/client";

/**
 * Prisma Client Singleton pattern for Next.js and serverless environments.
 * Prevents multiple instances of PrismaClient in development caused by Hot Module Replacement (HMR),
 * which would otherwise exhaust MySQL's max_connections pool.
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prismaGlobal: PrismaClientSingleton | undefined;
};

export const db = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = db;
}

export default db;
