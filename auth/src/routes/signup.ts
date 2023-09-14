import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";

import { validateRequest, BadRequestError } from "@abitickets/common";
import { User } from "../models/user";

const router = express.Router();
router.post(
	"/api/users/signup",
	[
		body("email").isEmail().withMessage("Email must be valid"),
		body("password")
			.trim()
			.isLength({ min: 4, max: 20 })
			.withMessage("Password must be between 4 and 20 characters"),
	],
	validateRequest, //now errors contain an object if the above validation fails
	async (req: Request, res: Response) => {
		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			// console.log("email already in use");
			// return res.send({});
			throw new BadRequestError("Email already exist");
		}

		// 'User.buildUser()' is same as 'new User' to create a new user
		const user = User.buildUser({ email, password });
		await user.save();

		// Generate JWT
		const userJwt = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_KEY!
		);
		// Store it on session object
		req.session = {
			jwt: userJwt,
		};

		res.status(201).send(user);
	}
);

export { router as signupRouter };
