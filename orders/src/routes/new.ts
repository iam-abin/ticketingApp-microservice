import express, { Request, Response } from "express";
import {
	NotFoundError,
	requireAuth,
	validateRequest,
	OrderStatus,
	BadRequestError,
} from "@abitickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";

import { Ticket } from "../models/ticket";
import { Order } from "../models/order";

const router = express.Router();

const EXPIRATION_TIME_SECONDS = 15 * 60; // 15 seconds *60 ie, 15 minutes

router.post(
	"/api/orders",
	requireAuth,
	[
		body("ticketId")
			.not()
			.isEmpty()
			.custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // to check user is providing a valid mongoId as ticketId (it's not necessary)
			.withMessage("ticketId must be provided"),
	],
	validateRequest,
	async (req: Request, res: Response) => {
		const { ticketId } = req.body;

		// Find the ticket the user trying to order in the database
		const ticket = await Ticket.findById(ticketId);
		if (!ticket) {
			throw new NotFoundError();
		}

		// Make sure that the ticket is not already reserved
		const isReserved = await ticket.isReserved(); // isReserved is a function defined in ticket document

		if (isReserved) {
			throw new BadRequestError("icket is already reserved");
		}
		// Calculate an expiration date for this order
		const expiration = new Date();
		expiration.setSeconds(expiration.getSeconds()+EXPIRATION_TIME_SECONDS)

		// Build the order and save it to the database
		const order = Order.build({
			userId: req.currentUser!.id,
			status: OrderStatus.Created,
			expiresAt: expiration,
			ticket
		})
		await order.save();

		// Publish an event saying that an order was created

		res.status(201).send(order);
	}
);

export { router as newOrderRouter };
