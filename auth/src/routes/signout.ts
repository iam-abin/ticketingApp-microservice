import express from "express";

const router = express.Router();
router.post("/api/users/signout", (req, res) => {
	const { email, password } = req.body;
	res.send("hi there signout");
});

export { router as signoutRouter };
