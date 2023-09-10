import request from "supertest";
import { app } from "../../app";

// here we are going to write individual test cases
it("returns a 201 on successful signup", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);
});

it("returns a 400 with an invalid email", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "dskjkd",
			password: "password",
		})
		.expect(400);
});

it("returns a 400 with an invalid password", async () => {
	return request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
			password: "p",
		})
		.expect(400);
});

// to write 2 seperate request inside 1 handler use await (to wait the second one unti first one is finished)
it("returns a 400 with missing email or password", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@gmail.com",
		})
		.expect(400);

	await request(app)
		.post("/api/users/signup")
		.send({
			password: "abin1",
		})
		.expect(400);
});

it("returns a 400 with missing email and password", async () => {
	return request(app).post("/api/users/signup").send({}).expect(400);
});

it("disallows duplicate emails", async () => {
	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

	await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(400);
});

it("sets a cookie after successful signup", async () => {
	const response = await request(app)
		.post("/api/users/signup")
		.send({
			email: "test@test.com",
			password: "password",
		})
		.expect(201);

    expect(response.get('Set-Cookie')).toBeDefined()
});
