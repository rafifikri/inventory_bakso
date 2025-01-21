import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { db_inventory } from "./config/database.js";
import BaksoRoute from "./routes/router.js";
import { PORT } from "./config/envConfig.js";

(async () => {
  try {
    await db_inventory.sync();
    console.log("Sistem Inventory database synced successfully");
  } catch (error) {
    console.error("Failed to sync databases:", error);
  }
})();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(BaksoRoute);

app.listen(PORT, () => console.log("Server up and running..."));
