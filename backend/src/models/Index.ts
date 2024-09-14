import { Sequelize } from "sequelize-typescript";
import fs from "fs";
import path from "path";
import config, { IConfig } from "../config/config"; // Import your config class
import { Dialect } from "sequelize"; // For type safety of dialect

// Get environment configuration
const env = process.env.NODE_ENV || "development";
const dbConfig: IConfig = config[env]; // This now works because config holds multiple environment configs

// Initialize Sequelize
let sequelize: Sequelize;
if (dbConfig.use_env_variable) {
  // Use environment variable for the database connection if provided
  sequelize = new Sequelize(process.env[dbConfig.use_env_variable] as string, {
    dialect: dbConfig.dialect,
    models: [path.join(__dirname, "models")], // Path to models folder
  });
} else {
  // Use config for the database connection
  sequelize = new Sequelize({
    database: dbConfig.database,
    username: dbConfig.username,
    password: dbConfig.password,
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    models: [path.join(__dirname, "models")], // Path to models folder
  });
}

// Dynamically load all model files
const modelsPath = path.resolve(__dirname, "./");
fs.readdirSync(modelsPath)
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts")) // Filter out test files
  .forEach((file) => {
    const model = require(path.join(modelsPath, file)).default;
    sequelize.addModels([model]); // Add model to Sequelize
  });

// Sync the database (optional)
sequelize
  .sync({ force: false })
  .then(() => console.log("Database synced successfully"))
  .catch((err) => console.error("Failed to sync the database:", err));

export default sequelize;
