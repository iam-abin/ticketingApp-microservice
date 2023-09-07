import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../errors/request-validation-error";
import { BadRequestError } from "../errors/bad-request-error";
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
	async (req: Request, res: Response) => {
		const errors = validationResult(req); //now errors contain an object if the above validation fails

		if (!errors.isEmpty()) {
			throw new RequestValidationError(errors.array());
		}

		const { email, password } = req.body;
		const existingUser = await User.findOne({ email });

		if (existingUser) {
			// console.log("email already in use");
			// return res.send({});
			throw new BadRequestError('Email already exist')
		}

		// 'User.buildUser()' is same as 'new User' to create a new user
		const user = User.buildUser({ email, password });
		await user.save();

		res.status(201).send(user)
	}
);

export { router as signupRouter };
