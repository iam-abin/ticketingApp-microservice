import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface UserPayload {
	id: string;
	email: string;
}

// to reach to an existing type definition or interface of 'Request' and make a modification to it

// here we are telling ts that , inside of the express project ,find the predefined Interface of
// Request and add following modifiations

declare global {
	namespace Express {
		interface Request {
			currentUser?: UserPayload; // '?' indicate if currentUser is defined
		}
	}
}

export const currentUser = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	if (!req.session?.jwt) {
		return next();
	}

	try {
		// 'as' keyword is used to show payload has the same structure as 'UserPayload interface'.
		const payload = jwt.verify(
			req.session.jwt,
			process.env.JWT_KEY!
		) as UserPayload;

		req.currentUser = payload;
        
	} catch (error) {}

	next();
};
