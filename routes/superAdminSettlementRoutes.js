import express from "express";

import {
    getProviderSettlementSummary,
    settleProviderPayments,
} from "../controllers/superAdminSettlementController.js";

// import { SuperAdminAuthMiddleware }
// from "../middleware/SuperAdminAuthMiddleware.js";
import { SuperAdminAuthMiddleware }
from "../middleware/superAdminAuth.js";

const settelRouter = express.Router();


// ==========================================
// GET PROVIDER SETTLEMENT SUMMARY
// ==========================================

settelRouter.get(
    "/provider-settlement-summary",
    SuperAdminAuthMiddleware,
    getProviderSettlementSummary
);


// ==========================================
// SETTLE PROVIDER PAYMENT
// ==========================================

settelRouter.put(
    "/settle-provider/:sprovid",
    SuperAdminAuthMiddleware,
    settleProviderPayments
);

export default settelRouter;