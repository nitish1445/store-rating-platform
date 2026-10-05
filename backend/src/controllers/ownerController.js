import Owner from "../models/ownerModel.js";
import bcrypt from "bcrypt";

export const getProfile = async (req, res, next) => {
  try {
    const owner = await Owner.getProfile(req.user.id);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      owner,
    });
  } catch (error) {
    next(error);
  }
};

export const getOverview = async (req, res, next) => {
  try {
    const overview = await Owner.getOverview(req.user.id);

    if (!overview) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    return res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    next(error);
  }
};

export const getStore = async (req, res, next) => {
  try {
    const store = await Owner.getStore(req.user.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    return res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const store = await Owner.getStoreById(req.user.id, id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    return res.status(200).json({
      success: true,
      store,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { name, email, address } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    if (!address || !address.trim()) {
      return res.status(400).json({
        success: false,
        message: "Store address is required.",
      });
    }

    if (address.trim().length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters.",
      });
    }

    const store = await Owner.updateStore(req.user.id, id, {
      name: name.trim(),
      email: email?.trim() || null,
      address: address.trim(),
    });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store updated successfully.",
      store,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteStore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const store = await Owner.deleteStore(req.user.id, id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: "Store not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Store deleted successfully.",
      store,
    });
  } catch (error) {
    next(error);
  }
};

export const getRatings = async (req, res, next) => {
  try {
    const ratings = await Owner.getRatings(req.user.id);

    return res.status(200).json({
      success: true,
      ratings,
    });
  } catch (error) {
    next(error);
  }
};

export const getRatingById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const rating = await Owner.getRatingById(req.user.id, id);

    if (!rating) {
      return res.status(404).json({
        success: false,
        message: "Rating not found.",
      });
    }

    return res.status(200).json({
      success: true,
      rating,
    });
  } catch (error) {
    next(error);
  }
};
export const getCustomers = async (req, res, next) => {
  try {
    const customers = await Owner.getCustomers(req.user.id);

    return res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    next(error);
  }
};

export const getCustomerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const customer = await Owner.getCustomerById(req.user.id, id);

    if (!customer.length) {
      return res.status(404).json({
        success: false,
        message: "Customer not found.",
      });
    }

    return res.status(200).json({
      success: true,
      customer,
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
          "Password must be 8–16 characters with at least one uppercase letter and one special character.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const owner = await Owner.updatePassword(req.user.id, hashedPassword);

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner account not found.",
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
