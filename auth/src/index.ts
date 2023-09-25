import mongoose from "mongoose";

import { app } from "./app";

const start = async () => {
	//if we do not set jwt_key
	if (!process.env.JWT_KEY) {
		throw new Error("JWT_KEY must be defined");
	}

	//if we do not set mongo_uri
	if (!process.env.MONGO_URI) {
		throw new Error("MONGO_URI must be defined");
	}

	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("connected to mongodb");
	} catch (err) {
		console.error(err);
	}

	app.listen(3000, () => {
		console.log("auth Listening on port 3000....");
	});
};

start();
