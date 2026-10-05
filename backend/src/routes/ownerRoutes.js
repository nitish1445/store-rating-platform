import express from "express";

import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";

import {
  getProfile,
  updatePassword,
  getOverview,
  getStore,
  getStoreById,
  updateStore,
  deleteStore,
  getRatings,
  getRatingById,
  getCustomers,
  getCustomerById,
} from "../controllers/ownerController.js";

const router = express.Router();

// Owner routes : Authentication role check
router.use(authMiddleware);
router.use(roleMiddleware("owner"));
router.get("/overview", getOverview);
router.put("/password", updatePassword);
router.get("/profile", getProfile);
router.get("/store", getStore);
router.get("/store/:id", getStoreById);
router.put("/store/:id", updateStore);
router.delete("/store/:id", deleteStore);
router.get("/ratings", getRatings);
router.get("/ratings/:id", getRatingById);
router.get("/customers", getCustomers);
router.get("/customers/:id", getCustomerById);

export default router;
