import mongoose from "mongoose";

// interface describes properties used to create a ticket
interface PaymentAttributes {
	orderId: string;
	stripeId: string;
}

//interface describes properties  a saved ticket document has
interface PaymentDocument extends mongoose.Document {
    orderId: string;
	stripeId: string;
    // version:number // // we are not editing paymend in this app
	// createdAt: string
}

//interface describes properties  an overall model or collection has
interface PaymentModel extends mongoose.Model<PaymentDocument> {
	// build method is used to make validation or type checking on arguments used to create ticket document
	build(attributes: PaymentAttributes): PaymentDocument;
}

const paymentSchema = new mongoose.Schema(
	{
		orderId: {
			type: String,
			required: true,
		},
		stripeId: {
			type: String,
			required: true,
		}
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
			},
		},
	}
);


paymentSchema.statics.build = (attributes: PaymentAttributes) => {
	return new Payment(attributes);
};

const Payment = mongoose.model<PaymentDocument, PaymentModel>(
	"Payment",
	paymentSchema
);

export { Payment };
