import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dataBaseConn } from "./config/dbConn.js";

//Load routes
import { authenticationRouter } from "./routes/authentication_route.js";
import { eventRouter } from "./routes/event_routes.js";
import { googleRouter } from "./routes/google_routes.js";
import { userRouter } from "./routes/user_routes.js";

// logger
import { logger } from "./logging.js";

// Dotenv Config
import dotenv from "dotenv";
const env = dotenv.config({
  path: "./src/config/config.env",
});

logger.info("env: %j", env);
logger.info("NODE_ENV: %s", process.env.NODE_ENV);
logger.info("CLIENT_URL: %s", process.env.CLIENT_URL);
logger.info("MONGO_URI: %s", process.env.MONGO_URI);
logger.info("CLIENT_ID: %s", process.env.CLIENT_ID);

const app = express();

app.use(cookieParser());

//Connecting to the database
dataBaseConn();

//Bodyparser
app.use(bodyParser.json());

// Dev Loggin Middleware
if (process.env.NODE_ENV === "development") {
  const ORIGINS = [process.env.CLIENT_URL, "https://appoint.gawron.cloud", "http://localhost:5173", "http://localhost:5174"];
  logger.info("enabling CORS for %j", ORIGINS);
  app.use(
    cors({
      origin: ORIGINS,
      credentials: true,
    })
  );
}
else {
  const ORIGINS = [process.env.CLIENT_URL, "https://appoint.gawron.cloud"];
  logger.info("enabling CORS for %j", ORIGINS);
  app.use(
    cors({
      origin: ORIGINS,
      credentials: true,
    })
  );
}


//Use routes
const router = express.Router();
router.use("/auth/", authenticationRouter);
router.use("/events/", eventRouter);
router.use("/google/", googleRouter);
router.use("/users/", userRouter);
router.get("/ping", (req, res) => {
  res.status(200).send("OK")
})
app.use("/api/v1", router);

const PORT = process.env.PORT || 5000;

export const init = () => {
  const server = app.listen(PORT, () => {
    logger.info(`Server running on Port ${PORT}`);
  });
  return server;
}

import * as url from 'node:url';

if (import.meta.url.startsWith('file:')) { // (A)
  const modulePath = url.fileURLToPath(import.meta.url);
  if (process.argv[1] === modulePath) { // (B)
    init()
  }
}
