import "dotenv/config";
import "express-async-errors/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { json } from "express";
import serveStatic from "serve-static";
import corsOptions from "./config/corsOpetions.js";
import errHandler from "./middleware/errHandler.js";
import { logger, logEvents } from "./middleware/logger.js";
import errRout from "./routes/errRoute.js";
import router from "./routes/root.js";
import connectDB from "./config/dbConn.js";
import mongoose from "mongoose";
import userRoute from "./routes/userRoute.js";
import noteRoute from "./routes/noteRoute.js";
import AuthRoute from "./routes/AuthRoute.js";

const app = express();
const PORT = process.env.PORT;

connectDB();

app.use(logger);

app.use(cors(corsOptions));

app.use(json());

app.use(cookieParser());

app.use(serveStatic("public"));

app.use("/", router);

app.use("/auth", AuthRoute);

app.use("/users", userRoute);

app.use("/notes", noteRoute);

app.all("*", errRout);

app.use(errHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => {
    console.log(`Server is runing at ${PORT}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}\t`,
    "mongoErrLog.log"
  );
});
