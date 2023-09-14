import express from "express";

import { currentUser } from "@abitickets/common";
// import { requireAuth } from "../middlewares/require-auth";

const router = express.Router();

router.get("/api/users/currentuser", currentUser, (req, res) => {
	res.send({ currentUser: req.currentUser || null }); // if no user or req.currentUser is 'undefined' return 'null'
}); 

export { router as currentUserRouter };
