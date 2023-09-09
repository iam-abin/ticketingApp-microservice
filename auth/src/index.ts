import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import mongoose from "mongoose";
import morgan from "morgan";
import cookieSession from "cookie-session";

import { currentUserRouter } from "./routes/current-user";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";

import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();

app.set("trust proxy", true); // trust first proxy
app.use(json());

app.use(
	cookieSession({
		signed: false,
		secure: true,  // cookie will send for https connections only
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

const start = async () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined');
	  }                  //if we do not set jwt_key 
	  
	try {
		await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
		console.log("connected to mongodb");
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log("Listening on port 3000....");
	});
};

start();
