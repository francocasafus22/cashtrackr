import express from "express";
import morgan from "morgan";
import colors from "colors";
import { db } from "./config/db";
import budgetRouter from "./routes/budgetRouter";

async function connectDB() {
  try {
    await db.authenticate();
    db.sync(); // Crea las tablas y columnas en la db
    console.log(colors.blue.bold("Conexión exitosa a la base de datos."));
  } catch (error) {
    console.log(colors.red.bold("Falló la conexión a la base de datos."));
  }
}

connectDB();

const app = express();

app.use(morgan("dev"));

app.use(express.json());

app.use("/api/budgets", budgetRouter);

export default app;
