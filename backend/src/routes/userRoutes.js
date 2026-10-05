import express from "express";

import {
  getAllStores,
  getStoreById,
  getMyRatings,
  createOrUpdateRating,
  deleteMyRating,
  getProfile,
  updatePassword,
} from "../controllers/userController.js";

import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// User routes : Authentication role check
router.use(authMiddleware);
router.use(roleMiddleware("user"));

router.get("/stores", getAllStores);
router.get("/stores/:id", getStoreById);
router.get("/ratings", getMyRatings);
router.put("/stores/:id/rating", createOrUpdateRating);
router.delete("/stores/:id/rating", deleteMyRating);
router.get("/profile", getProfile);
router.put("/password", updatePassword);

export default router;
