import express, { Request, Response, Router } from "express";
import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
	const tickets = await Ticket.find({
		orderId: undefined // to show only un reservered tickets that can be ordered
	});

	res.send(tickets);
});

export { router as indexTicketRouter };
