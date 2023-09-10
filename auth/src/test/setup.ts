import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
// import request from "supertest";

// import { app } from "../app";

// // if we want to use signup() fn (after line 41 ) on the other test files we need to declare it globally
// declare global {
// 	var signin: () => Promise<string[]>;
// }


// Initialize and start the MongoDB memory-server before all tests start
let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = "jnadkf";

	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {});
});

// before each test starts, we need to delete all data inside mongodb database
beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

// we need to stop mongodb memory-server after we finish running all tests
afterAll(async () => {
	if (mongo) {
		await mongo.stop();
	}
	await mongoose.connection.close();
});

// // helper fn only available in the test environment 
// // this can be reuse whenever we need signin fn during testing

// global.signin = async () => {
// 	const response = await request(app)
// 		.post("/api/users/signup")
// 		.send({
// 			email: "test@test.com",
// 			password: "password",
// 		})
// 		.expect(201);

// 	const cookie = response.get('Set-Cookie')
// 	return cookie
// };
