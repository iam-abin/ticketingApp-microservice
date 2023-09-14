import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import morgan from "morgan";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

import { errorHandler, NotFoundError } from "@abitickets/common"; // my custom module

const app = express();

app.set("trust proxy", true); // trust first proxy
app.use(json());

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== 'test' // if 'secure: true' cookie will send for https connections only
	})
);
app.use(morgan("dev"));

app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
