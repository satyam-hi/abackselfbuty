// import { Router } from "express";
// import {getAllProvider,registerProvider} from "../controllers/providerController.js"


// const providerRouter = Router();

// providerRouter.get("/",getAllProvider)
// providerRouter.post("/register",registerProvider)


// export default providerRouter;


import { Router } from "express";

import {
    getAllProvider,
    registerProvider,
    verifyProviderEmail,
    providerForgotPassword, 
    loginProvider,
    logoutProvider,
    getProviderById,
    verifyProviderToken,
    providerPaymentComplete,
    providerPaymentDue,
    updateProviderProfile

} from "../controllers/providerController.js";

import { providerAuthMiddleware } from "../middleware/providerAuth.js";

const providerRouter = Router();

providerRouter.get("/providers", getAllProvider);
providerRouter.post("/register", registerProvider);
providerRouter.post("/verify-email", verifyProviderEmail);
providerRouter.post("/forgot-password", providerForgotPassword);
providerRouter.post("/login", loginProvider);
// providerRouter.post("/logout", providerAuthMiddleware, logoutProvider);
providerRouter.post("/logout", logoutProvider);
providerRouter.get("/provider/:sprovid", getProviderById);
providerRouter.post("/verify-token", verifyProviderToken);
providerRouter.put("/update-profile/:sprovid", updateProviderProfile);
providerRouter.put("/payment-due/:sprovid", providerPaymentDue);
providerRouter.put("/payment-complete/:sprovid", providerPaymentComplete);

export default providerRouter;
