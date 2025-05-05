import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrima = globalThis;

export const db = globalForPrima.prisma || new PrismaClient();



if (process.env.NODE_ENV !== "production") globalForPrima.prisma = db