import Order from "../models/orderModel.js";
import Sprovider from "../models/providerModel.js";


// ======================================================
// GET PROVIDERS WITH PENDING SETTLEMENT SUMMARY
// ======================================================

export const getProviderSettlementSummary = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const skip = (page - 1) * limit;

        // total providers
        const totalProviders = await Sprovider.countDocuments();

        // get providers with pagination
        const providers = await Sprovider.find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        // settlement summary for each provider
        const providerData = await Promise.all(

            providers.map(async (provider) => {

                const pendingOrders = await Order.find({
                    sprovid: provider.sprovid,
                    settleStatus: "pending",
                });

                const totalPendingOrders = pendingOrders.length;

                const totalPendingAmount =
                    pendingOrders.reduce(
                        (sum, order) => sum + order.totalAmount,
                        0
                    );

                return {
                    providerId: provider.sprovid,
                    providerName: provider.name,
                    providerEmail: provider.email,
                    providerMobile: provider.mobile,

                    totalPendingOrders,

                    totalPendingAmount,
                };
            })
        );

        return res.status(200).json({
            success: true,

            providers: providerData,

            pagination: {
                totalProviders,
                page,
                limit,
                totalPages: Math.ceil(
                    totalProviders / limit
                ),
            },
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};



// ======================================================
// SETTLE ALL PENDING ORDERS OF A PROVIDER
// ======================================================

export const settleProviderPayments = async (req, res) => {

    try {

        const { sprovid } = req.params;

        // update all pending orders
        const result = await Order.updateMany(
            {
                sprovid,
                settleStatus: "pending",
            },
            {
                $set: {
                    settleStatus: "completed",
                    settleDate: new Date(),
                },
            }
        );

        return res.status(200).json({
            success: true,
            message: "Settlement completed successfully",

            updatedOrders: result.modifiedCount,
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};