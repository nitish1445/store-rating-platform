import express from "express";

import {
  authMiddleware,
  roleMiddleware,
} from "../middleware/authMiddleware.js";

import {
  getOverview,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getOwners,
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore,
  getRatings,
  getRatingById,
  getProfile,
} from "../controllers/adminController.js";

const router = express.Router();

// Admin routes : Authentication role check
router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/profile", getProfile);
router.get("/overview", getOverview);
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.get("/owners", getOwners);
router.get("/stores", getStores);
router.get("/stores/:id", getStoreById);
router.post("/stores", createStore);
router.put("/stores/:id", updateStore);
router.delete("/stores/:id", deleteStore);
router.get("/ratings", getRatings);
router.get("/ratings/:id", getRatingById);

export default router;
