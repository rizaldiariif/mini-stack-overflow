import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";

import { errorHandler } from "./middlewares/error-handler";

import { NotFoundError } from "./errors/not-found-error";

import { authRouter } from "./routes/auth";

const app = express();

// Set Middlewares
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({ signed: false, secure: process.env.NODE_ENV !== "test" })
);

app.use("/api/v1/users", authRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

// Set Custom Error Handler
app.use(errorHandler);

export { app };
