import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        items: [
            {
                sproductid: {
                    type: String,
                },

                name: String,

                quantity: Number,

                price: Number,
            },
        ],

        totalAmount: {
            type: Number,
            required: true,
        },
        tokenNumber: {
            type: Number,
            required: true,
        },
        sprovid: {
            type: String,
            required: true,
        },
         sprovname: {
            type: String,
        },

        customerMobile: {
            type: String,
            required: true,
        },

        sptypename: {
            type: String,
        },
        // settleStatus: {
        //     type: String,
        // },
        // settleDate: {
        //     type: String,
        // },
        settleStatus: {
            type: String,
            enum: ["pending", "completed", "counter_completed"],
            default: "pending",
        },

        settleDate: {
            type: Date,
            default: null,
        },

       ordrType :String,
        tableNumber :String,
        // setelStatus :String,
        orderStatus: {
            type: String,
            enum: ["Pending","Accepted","Skipped","Working","Ready","On The Way", "Completed","Cancelled"],
            default: "Pending",
        },

        paymentMethod: {
            type: String,
            default: "Cash",
        },
        paymentStatus: {
            type: String,
            default: "UnPaid",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;