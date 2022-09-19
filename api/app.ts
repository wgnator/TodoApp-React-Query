import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import type { Request, Response, NextFunction } from "express";
import cors from "cors";
import createError from "http-errors";
import { StatusCodes } from "http-status-codes";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import todoRouter from "./routes/todoRouter";
import userRouter from "./routes/userRouter";
import path from "path";

const app = express();

const __dirname = path.resolve();
console.log("dirname:", __dirname);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "https://nator-todoapp.netlify.app"];
const corsOptions = {
  origin: function (origin: any, callback: any) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
if (__dirname.indexOf("apache") > -1)
  app.use("/", express.static(path.join(__dirname + "/public")));

app.use("/todos", todoRouter);
app.use("/users", userRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err: Error & { status: number }, req: Request, res: Response, next: NextFunction) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err);
});

export default app;
