import mongoose from "mongoose";
import { PasswordManage } from "../services/password";

// 1.it is an interface that describe the properties that are required to create a new user
interface UserAttributes {
	email: string;
	password: string;
}

// 3.an interface that describes the properties that a user model has
// here we are taking all the properties that already exist on 'mongoose.Model' interface and adding new properties on top of that
interface UserModel extends mongoose.Model<UserDoc> {
	// it tells ts the existence of buildUser method and what properties it accepts
	buildUser(attributes: UserAttributes): UserDoc;
}

// 2.an inteface that describe the properties a created user document has
// here we are taking all the properties that 'mongoose.Document' already has and adding new properties on top of that
interface UserDoc extends mongoose.Document {
	email: string;
	password: string;
	// createdAt:string;
	// updatedAt:string
}

// 4. create a schema
const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
	},
	{
		toJSON: { // to reformat id and remove password,__v from response when converting to json (we can also use other approaches)
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.password;
				delete ret.__v;
			},
		},
	}
);

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await PasswordManage.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
});

// 5.In Mongoose, you can also add custom functions to a model using statics.
// Unlike methods, which are available on instances of the model, statics are available directly on the model itself.
// it is used inside routes/signup
userSchema.statics.buildUser = (attributes: UserAttributes) => {
	return new User(attributes);
};

// 6.hover on 'User' ,we can see that 'User' is getting 'UserMdel', ie,a Second arg indicate returning type
const User = mongoose.model<UserDoc, UserModel>("User", userSchema); // ctrl+click on model

export { User };
