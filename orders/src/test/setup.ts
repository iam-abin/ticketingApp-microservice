import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// // if we want to use signup() fn (after line 41 ) on the other test files we need to declare it globally
declare global {
	var signin: () => string[];
}

// telling jest to use our mock file ,ie, instead of using original NATS
// if anything try to import original 'nats-wrapper' file, it redirect that import to our fake file
jest.mock('../nats-wrapper')

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
	jest.clearAllMocks();
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

global.signin = () => {
	// Build a jwt payload having {id, email}
	const payload = {
		id: new mongoose.Types.ObjectId().toHexString(),
		email: "test@test.com",
	};

	// Create the jwt
	// '!' telling TypeScript to trust that the variable process.env.JWT_KEY is not null or undefined
	const token = jwt.sign(payload, process.env.JWT_KEY!);

	// Build session object. {jwt: MY_JWT}
	const session = { jwt: token };

	// Turn that session into JSON
	const sessionJSON = JSON.stringify(session);

	// Take JSON and encode it as base64
	const base64 = Buffer.from(sessionJSON).toString("base64");

	// return a string thats the cookie with the encoded data
	return [`session=${base64}`];
};
