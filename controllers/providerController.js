
import Sprovider from "../models/providerModel.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/sendEmail.js";

/**
 * @desc    Get all providers
 * @route   GET /api/provider
 * @access  Public/Admin
 */
// export const getAllProvider = async (req, res) => {
//     try {
//         const providers = await Sprovider.find({});
//         return res.status(200).json({
//             success: true,
//             message: "All providers fetched successfully",
//             providers,
//         });
//     } catch (error) {
//         console.error("Error fetching provider:", error);
//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };

// export const getAllProvider = async (req, res) => {
//     try {

//         const {
//             cityId,
//             localAreaId,
//             serviceId
//         } = req.query;

//         let filter = {};

//         // ✅ FILTER BY CITY
//         if (cityId) {
//             filter.cityId = cityId;
//         }

//         // ✅ FILTER BY LOCAL AREA
//         if (localAreaId) {
//             filter.localAreaId = localAreaId;
//         }

//         // ✅ FILTER BY SERVICE
//         if (serviceId) {
//             filter.serviceIds = { $in: [serviceId] };
//         }

//         const providers = await Sprovider.find(filter);

//         return res.status(200).json({
//             success: true,
//             message: "Providers fetched successfully",
//             providers,
//         });

//     } catch (error) {
//         console.error("Error fetching provider:", error);

//         return res.status(500).json({
//             success: false,
//             message: "Internal Server Error",
//             error: error.message,
//         });
//     }
// };


export const getAllProvider = async (req, res) => {
    try {

        const {
            cityId,
            localAreaId,
            serviceId,
            page = 1,
            limit = 9,
        } = req.query;

        let filter = {};

        // ✅ FILTERS
        if (cityId) {
            filter.cityId = cityId;
        }

        if (localAreaId) {
            filter.localAreaId = localAreaId;
        }

        if (serviceId) {
            filter.serviceIds = { $in: [serviceId] };
        }

        // ✅ PAGINATION
        const currentPage = Number(page);
        const pageLimit = Number(limit);

        const skip = (currentPage - 1) * pageLimit;

        // TOTAL COUNT
        const totalProviders = await Sprovider.countDocuments(filter);

        // FETCH DATA
        const providers = await Sprovider.find(filter).select("-password -accesstoken -sessionAccesstoken -emailVerifyAccesstoken").skip(skip)
            .limit(pageLimit)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Providers fetched successfully",

            providers,

            pagination: {
                total: totalProviders,
                page: currentPage,
                limit: pageLimit,
                totalPages: Math.ceil(totalProviders / pageLimit),
            },
        });

    } catch (error) {

        console.error("Error fetching provider:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
/**
 * @desc    Register provider
 * @route   POST /api/provider/register
 * @access  Public
 */
export const registerProvider = async (req, res) => {
    try {
        const { name, email, password, mobile, cityId, localAreaId, serviceIds } = req.body;

        if (!name || !email || !password || !mobile) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const existingProvider = await Sprovider.findOne({ email });
        if (existingProvider) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered",
            });
        }

        const sprovid = `SPROVIDER-${Date.now()}`;
        const accesstoken = "";
        const amount_due = "00.00";
        const sessionAccesstoken = "";
        const status = "active";
        const additionalDetails = { dd: "test" };
        const emailVerifyAccesstoken = `${Math.floor(
            100000 + Math.random() * 900000
        )}`;
        const emailVerify = false;
        const trialStart = new Date();
        const trialEnd = new Date(trialStart);
        trialEnd.setDate(trialEnd.getDate() + 7);

        const newProvider = await Sprovider.create({
            sprovid,
            name,
            email,
            mobile,
            password,
            amount_due,
            accesstoken,
            sessionAccesstoken,
            emailVerifyAccesstoken,
            emailVerify,
            status,
            additionalDetails,
            subscription: {
                active: true,
                plan: "trial",
                amount: 0,
                currency: "USD",
                startDate: trialStart,
                lastPaidDate: null,
                nextBillingDate: trialEnd,
                status: "trial",
            },
            // ✅ NEW
            cityId: cityId || null,
            localAreaId: localAreaId || null,
            serviceIds: serviceIds || [],
        });

        await sendEmail(
            email,
            "Verify Email",
            `Your verification code is: ${emailVerifyAccesstoken}`
        );

        const providerResponse = newProvider.toObject();
        delete providerResponse.password;

        return res.status(201).json({
            success: true,
            message: "Provider registered successfully. Check your email for OTP.",
            provider: providerResponse,
        });
    } catch (error) {
        console.error("Error registering provider:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Verify Email
 * @route   POST /api/provider/verify-email
 * @access  Public
 */
export const verifyProviderEmail = async (req, res) => {
    try {
        const { email, password, otp } = req.body;

        if (!email || !password || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email, New Password, and OTP required",
            });
        }

        const provider = await Sprovider.findOne({ email });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        if (provider.emailVerifyAccesstoken !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }

        provider.emailVerify = true;
        provider.emailVerifyAccesstoken = "";
        provider.password = password;
        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("Error verifying provider email:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Forgot password (Send OTP)
 * @route   POST /api/provider/forgot-password
 * @access  Public
 */
export const providerForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const provider = await Sprovider.findOne({ email });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

        provider.emailVerifyAccesstoken = otp;
        await provider.save();

        await sendEmail(
            email,
            "Reset Your Password",
            `Your password reset OTP is: ${otp}`
        );

        return res.status(200).json({
            success: true,
            message: "OTP sent to your email",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Login provider
 * @route   POST /api/provider/login
 * @access  Public
 */
export const loginProvider = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const provider = await Sprovider.findOne({ email });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        if (!provider.emailVerify) {
            return res.status(401).json({
                success: false,
                message: "Please verify your email first",
            });
        }

        const isMatch = await provider.comparePassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password",
            });
        }

        const token = jwt.sign(
            { id: provider.sprovid, email: provider.email },
            "SECRET_KEY",
            { expiresIn: "7d" }
        );

        provider.accesstoken = token;
        await provider.save();

        const providerData = provider.toObject();
        delete providerData.password;

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            provider: providerData,
        });
    } catch (error) {
        console.log("Login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Logout provider
 * @route   POST /api/provider/logout
 * @access  Public
 */
export const logoutProvider = async (req, res) => {
    try {
        const { sprovid } = req.body;

        const provider = await Sprovider.findOne({ sprovid });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        provider.accesstoken = "";
        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Logout successful",
        });
    } catch (error) {
        console.log("Logout error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};



//   ============   SINGLE PROVIDER ==============

export const getProviderById = async (req, res) => {
    try {
        const { sprovid } = req.params;

        if (!sprovid) {
            return res.status(400).json({
                success: false,
                message: "sprovid is required",
            });
        }

        const provider = await Sprovider.findOne({ sprovid }).select("-password -accesstoken -sessionAccesstoken -emailVerifyAccesstoken");

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Provider fetched successfully",
            provider,
        });
    } catch (error) {
        console.error("Error fetching provider by sprovid:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};




//==============verify token ======================

export const verifyProviderToken = async (req, res) => {
    const { token, id, role } = req.body;

    // Check for required fields
    if (!token || !id || !role) {
        return res.status(400).json({
            success: false,
            valid: false,
            message: "Token, id and role are required",
        });
    }

    try {
        const sprovid = id;
        const accesstoken = token;

        // Check if a user exists with this ID + token
        const user = await Sprovider.findOne({ sprovid, accesstoken });

        if (!user) {
            return res.json({
                success: false,
                valid: false,
                message: "Invalid token or user not found",
            });
        }

        return res.json({
            success: true,
            valid: true, // token matched
        });

    } catch (err) {
        return res.json({
            success: false,
            valid: false,
            message: "Error verifying token",
        });
    }
};




/**
 * @desc    Mark payment as completed
 * @route   PUT /api/provider/payment-complete/:sprovid
 * @access  Admin
 */
export const providerPaymentComplete = async (req, res) => {
    try {
        const { sprovid } = req.params;

        if (!sprovid) {
            return res.status(400).json({
                success: false,
                message: "sprovid is required",
            });
        }

        const provider = await Sprovider.findOne({ sprovid });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        provider.payment_due = false;
        provider.amount_due = "00.00";

        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Payment marked as completed",
            provider,
        });
    } catch (error) {
        console.error("Payment complete error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
/**
 * @desc    Set payment due with amount
 * @route   PUT /api/provider/payment-due/:sprovid?amount=500.00
 * @access  Admin
 */
export const providerPaymentDue = async (req, res) => {
    try {
        const { sprovid } = req.params;
        const { amount } = req.query;

        if (!sprovid || !amount) {
            return res.status(400).json({
                success: false,
                message: "sprovid and amount are required",
            });
        }

        const provider = await Sprovider.findOne({ sprovid });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        provider.payment_due = true;
        provider.amount_due = amount;

        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Payment due updated successfully",
            provider,
        });
    } catch (error) {
        console.error("Payment due error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

const getNextMonthlyBillingDate = (date = new Date()) => {
    const next = new Date(date);
    next.setMonth(next.getMonth() + 1);
    return next;
};

/**
 * @desc    Subscribe provider to monthly plan
 * @route   PUT /api/provider/subscribe/:sprovid
 * @access  Admin/Private
 */
export const subscribeProvider = async (req, res) => {
    try {
        const { sprovid } = req.params;
        const { plan = "monthly", amount, currency = "INR" } = req.body;

        if (!sprovid || !amount) {
            return res.status(400).json({
                success: false,
                message: "sprovid and amount are required to create a subscription",
            });
        }

        const provider = await Sprovider.findOne({ sprovid });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        const now = new Date();
        provider.subscription = {
            active: true,
            plan,
            amount: Number(amount),
            currency,
            startDate: now,
            lastPaidDate: now,
            nextBillingDate: getNextMonthlyBillingDate(now),
            status: "active",
        };

        provider.payment_due = false;
        provider.amount_due = "0.00";
        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Provider subscribed successfully",
            provider,
        });
    } catch (error) {
        console.error("Subscribe provider error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Renew provider subscription for the next month
 * @route   PUT /api/provider/renew-subscription/:sprovid
 * @access  Admin/Private
 */
export const renewProviderSubscription = async (req, res) => {
    try {
        const { sprovid } = req.params;

        if (!sprovid) {
            return res.status(400).json({
                success: false,
                message: "sprovid is required",
            });
        }

        const provider = await Sprovider.findOne({ sprovid });

        if (!provider || !provider.subscription?.active) {
            return res.status(404).json({
                success: false,
                message: "Active subscription not found for this provider",
            });
        }

        const now = new Date();
        provider.subscription.lastPaidDate = now;
        provider.subscription.nextBillingDate = getNextMonthlyBillingDate(now);
        provider.subscription.status = "active";

        provider.payment_due = false;
        provider.amount_due = "0.00";

        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Provider subscription renewed successfully",
            provider,
        });
    } catch (error) {
        console.error("Renew subscription error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Cancel provider subscription
 * @route   PUT /api/provider/cancel-subscription/:sprovid
 * @access  Admin/Private
 */
export const cancelProviderSubscription = async (req, res) => {
    try {
        const { sprovid } = req.params;

        if (!sprovid) {
            return res.status(400).json({
                success: false,
                message: "sprovid is required",
            });
        }

        const provider = await Sprovider.findOne({ sprovid });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        provider.subscription.active = false;
        provider.subscription.status = "cancelled";
        provider.subscription.nextBillingDate = null;

        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Provider subscription cancelled successfully",
            provider,
        });
    } catch (error) {
        console.error("Cancel subscription error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Get provider subscription details
 * @route   GET /api/provider/subscription/:sprovid
 * @access  Public/Admin
 */
export const getProviderSubscription = async (req, res) => {
    try {
        const { sprovid } = req.params;

        if (!sprovid) {
            return res.status(400).json({
                success: false,
                message: "sprovid is required",
            });
        }

        const provider = await Sprovider.findOne({ sprovid }).select("subscription payment_due amount_due sprovid name email status");

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Provider subscription fetched successfully",
            subscription: provider.subscription,
            payment_due: provider.payment_due,
            amount_due: provider.amount_due,
        });
    } catch (error) {
        console.error("Get provider subscription error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

/**
 * @desc    Update provider profile (except email)
 * @route   PUT /api/provider/update-profile/:sprovid
 * @access  Private
 */
export const updateProviderProfile = async (req, res) => {
    try {
        const { sprovid } = req.params;

        const provider = await Sprovider.findOne({ sprovid });

        if (!provider) {
            return res.status(404).json({
                success: false,
                message: "Provider not found",
            });
        }

        const {
            name,
            mobile,
            status,
            additionalDetails, cityId, localAreaId, serviceIds

        } = req.body;

        // ❌ Email NOT allowed to update

        if (name) provider.name = name;
        if (mobile) provider.mobile = mobile;
        if (status) provider.status = status;
        if (cityId) provider.cityId = cityId;
        if (localAreaId) provider.localAreaId = localAreaId;
        if (serviceIds) provider.serviceIds = serviceIds;

        if (additionalDetails) {
            provider.additionalDetails = {
                ...provider.additionalDetails,
                ...additionalDetails,
            };
        }


        await provider.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            provider,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};