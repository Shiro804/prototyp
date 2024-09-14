import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import db from "./models/Index";

const app = express();

// Middleware
app.use(bodyParser.json());

// Simple Route for health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "API is running" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Sync database and start server
const PORT = process.env.PORT || 5000;

// Use the Sequelize instance from your models folder to sync the database
db.sequelize
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
