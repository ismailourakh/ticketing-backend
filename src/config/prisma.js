// src/config/prisma.js
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

let prisma = null;

function getPrisma() {
  if (prisma) return prisma;

  const url = process.env.DATABASE_URL;
  if (!url) {
    // No DB configured (expected in Phase 1 ECS test)
    return null;
  }

  const adapter = new PrismaPg({ connectionString: url });
  prisma = new PrismaClient({ adapter });

  return prisma;
}

module.exports = { getPrisma };