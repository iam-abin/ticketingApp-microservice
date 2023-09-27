import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@abitickets/common";


export { OrderStatus };

// interface describes properties used to create an order
interface OrderAttributes {
	id: string;
	status: OrderStatus;
	version: number;
	price: number;
	userId: string;
}

//interface describes properties  a saved order document has
interface OrderDocument extends mongoose.Document {
	userId: string;
	version: number;
	price: number;
	status: OrderStatus;
	// createdAt: string
}

//interface describes properties  an overall model or collection has
interface OrdertModel extends mongoose.Model<OrderDocument> {
	// build method is used to make validation or type checking on arguments used to create order document
	build(attributes: OrderAttributes): OrderDocument;
}

const OrderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
		},
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

OrderSchema.set("versionKey", "version");
OrderSchema.plugin(updateIfCurrentPlugin); // to update the version of a document

OrderSchema.statics.build = (attributes: OrderAttributes) => {
	return new Order({
		_id: attributes.id,
		version: attributes.version,
		price: attributes.price,
		userId: attributes.userId,
		status: attributes.status,
	});
};

const Order = mongoose.model<OrderDocument, OrdertModel>("Order", OrderSchema);

export { Order };
