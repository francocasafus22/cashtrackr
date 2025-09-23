import { Sequelize } from "sequelize-typescript";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL =
  process.env.NODE_ENV === "test"
    ? process.env.DATABASE_URL_TEST
    : process.env.DATABASE_URL_DEVELOPMENT;

export const db = new Sequelize(DATABASE_URL, {
  models: [__dirname + "/../models/**/*"], // Tratar a todos los archivos de models como modelos
  logging: false,
  dialectOptions: {
    ssl: {
      require: false,
    },
  },
});
