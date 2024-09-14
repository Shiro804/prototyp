import { Dialect } from "sequelize";

// Define IConfig as before
export interface IConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  dialect: Dialect;
  use_env_variable?: string;
}

// Update config to be a record of environment configurations
const config: { [key: string]: IConfig } = {
  development: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "mydb",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "mydb",
    host: process.env.DB_HOST || "localhost",
    dialect: "postgres",
  },
};

export default config;
