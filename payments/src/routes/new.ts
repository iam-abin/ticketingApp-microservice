import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
	requireAuth,
	validateRequest,
	BadRequestError,
	NotFoundError,
	NotAuthorizedError,
	OrderStatus,
} from "@abitickets/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
	"/api/payments",
	requireAuth,
	[body("token").not().isEmpty(), body("orderId").not().isEmpty()],
	validateRequest,
	async (req: Request, res: Response) => {
		const { token, orderId } = req.body;

		const order = await Order.findById(orderId);

		if (!order) {
			throw new NotFoundError();
		}

		console.log("order is there");

		// we cannot pay for another user
		if (order.userId !== req.currentUser!.id) {
			throw new NotAuthorizedError();
		}
		console.log("user is there");

		if (order.status === OrderStatus.Cancelled) {
			throw new BadRequestError("cannot pay for a cancelled order");
		}
		console.log("order status  is there");

		try {
			const charge = await stripe.paymentIntents.create({
				amount: order.price*100, // 10000 paise = 100 INR
				currency: "usd",
				payment_method_types: ["card"],
			});
			// console.log("paymentIntents worked", charge);
			const payment = Payment.build({
				orderId,
				stripeId: charge.id,
			});
			await payment.save();

			new PaymentCreatedPublisher(natsWrapper.client).publish({
				id: payment.id,
				orderId: payment.orderId,
				stripeId: payment.stripeId,
			});

			res.status(201).send({ id: payment.id });
		} catch (error) {
			console.log("charge problem");
			console.log(error);
			console.log("charge problem");
		}
	}
);

export { router as createChargeRouter };
