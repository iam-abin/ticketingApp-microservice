import { Listener, OrderCancelledEvent, Subjects, OrderStatus } from "@abitickets/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCancelledListener extends Listener<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;
    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        // following can be given inside order model also as we have done is order services ticket model
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        })
        
        if(!order){
            throw new Error('Order not found')
        }

        order.set({status: OrderStatus.Cancelled});
        await order.save();

        msg.ack();
    }

}