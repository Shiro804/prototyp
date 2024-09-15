import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import router from "./routes/router";
import { PrismaClient } from "@prisma/client"; // Import Prisma Client
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient(); // Initialize Prisma Client

// Middleware
app.use(bodyParser.json());

// Simple Route for health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is rusnning" });
});

app.get("/api", router);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server and connect Prisma
const PORT = process.env.PORT || 5000;

async function main() {
  try {
    // Replace Sequelize sync with Prisma database connection check
    await prisma.$connect(); // Connect to the database
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main()
  .catch((err) => {
    console.error("Server error:", err);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Disconnect Prisma Client when app shuts down
  });

export default app;
