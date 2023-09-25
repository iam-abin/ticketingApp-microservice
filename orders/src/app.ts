import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import morgan from "morgan";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@abitickets/common"; // my custom module

import { deleteOrderRouter } from "./routes/delete";
import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";

const app = express();

app.set("trust proxy", true); // trust first proxy
app.use(json());

app.use(
	cookieSession({
		signed: false,
		secure: process.env.NODE_ENV !== "test", // if 'secure: true' cookie will send for https connections only
	})
);
app.use(morgan("dev"));

// it extract current user from jwt, if user is present add it to req.currentUser
app.use(currentUser);

app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(newOrderRouter);
app.use(showOrderRouter);

app.all("*", async () => {
	throw new NotFoundError();
});

app.use(errorHandler);

export { app };
