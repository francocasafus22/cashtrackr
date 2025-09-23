import { exit } from "node:process";
import { db } from "../config/db";

const clearData = async () => {
  try {
    await db.sync({ force: true });

    console.log("datos eliminados correctamente");
    db.close();
  } catch (error) {
    console.log(error.message);
    exit(1);
  }
};

if (process.argv[2] == "--clear") {
  clearData();
}
