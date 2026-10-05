import User from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.getProfile(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be 8-16 characters with at least one uppercase letter and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.updatePassword(req.user.id, hashedPassword);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User account not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllStores = async (req, res, next) => {
  try {
    const stores = await User.getAllStores();

    res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const store = await User.getStoreById(id, req.user.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRatings = async (req, res, next) => {
  try {
    const ratings = await User.getMyRatings(req.user.id);

    res.status(200).json({
      success: true,
      ratings,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyRatingForStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rating = await User.getMyRatingForStore(req.user.id, id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "You have not rated this store.",
      });
    }

    res.status(200).json({
      success: true,
      rating,
    });
  } catch (error) {
    next(error);
  }
};

export const createOrUpdateRating = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5.",
      });
    }

    /* Make sure store exists */
    const store = await User.getStoreById(id, req.user.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    const savedRating = await User.createOrUpdateRating(
      req.user.id,
      id,
      numericRating,
    );

    res.status(200).json({
      success: true,
      message: store.user_rating
        ? "Rating updated successfully."
        : "Rating submitted successfully.",
      rating: savedRating,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteMyRating = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedRating = await User.deleteMyRating(req.user.id, id);

    if (!deletedRating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Rating removed successfully.",
      rating: deletedRating,
    });
  } catch (error) {
    next(error);
  }
};
