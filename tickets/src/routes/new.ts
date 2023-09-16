// this route handilder is for creating a new ticket

import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest } from "@abitickets/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.post(
	"/api/tickets",
	requireAuth,
	[
		body("title").not().isEmpty().withMessage("Title is required"),
		body("price")
			.isFloat({ gt: 0 })
			.withMessage("Price must be grater than 0"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { title, price } = req.body;

		const ticket = Ticket.build({
			title,
			price,
			userId: req.currentUser!.id, // '!' is added because validateRequest will check currentUser is present or not
		});

		await ticket.save();

		res.status(201).send(ticket);
	}
);

export { router as createTicketRouter };
