import express, { Request, Response } from "express";
import { NotFoundError } from "@abitickets/common";

import { Ticket } from "../models/ticket";

const router = express.Router();

router.get("/api/tickets/:id", async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id)

    if(!ticket){
        throw new NotFoundError()
    }
    
    res.send(ticket)
});

// router.post()

export { router as showTicketRouter };
