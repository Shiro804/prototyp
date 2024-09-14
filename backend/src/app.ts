import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import router from "./routes/router";
import sequelize from "./models/Index"; // Ensure you're importing sequelize correctly

const app = express();

// Middleware
app.use(bodyParser.json());

// Simple Route for health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

app.get("/api", router);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

// Use the Sequelize instance from your models folder to sync the database
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Unable to connect to the database:", err);
  });

export default app;
