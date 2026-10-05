import bcrypt from "bcryptjs";
import Admin from "../models/adminModel.js";

const passwordRegex = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateUser = ({ name, email, address, password, role }) => {
  if (!name || name.trim().length < 20 || name.trim().length > 60) {
    return "Name must be between 20 and 60 characters.";
  }

  if (!emailRegex.test(email?.trim())) {
    return "Please enter a valid email address.";
  }

  if (!address || address.trim().length > 400) {
    return "Address cannot exceed 400 characters.";
  }

  if (password && !passwordRegex.test(password)) {
    return "Password must be 8-16 characters with at least one uppercase letter and one special character.";
  }

  if (role && !["admin", "user", "owner"].includes(role)) {
    return "Invalid user role.";
  }

  return null;
};

export const getOverview = async (req, res, next) => {
  try {
    const overview = await Admin.getOverview();

    return res.status(200).json({
      success: true,
      overview,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await Admin.getUsers(req.query);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await Admin.getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const { name, email, address, password, role } = req.body;

    const validationError = validateUser({
      name,
      email,
      address,
      password,
      role,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    if (!["admin", "user", "owner"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role.",
      });
    }

    const existingUser = await Admin.getUsers({
      email: email.trim(),
    });

    if (
      existingUser.some(
        (user) => user.email.toLowerCase() === email.trim().toLowerCase(),
      )
    ) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await Admin.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      password: hashedPassword,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, email, address, role } = req.body;

    const validationError = validateUser({
      name,
      email,
      address,
      role,
    });

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const user = await Admin.updateUser(req.params.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      role,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    const user = await Admin.deleteUser(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
      user,
    });
  } catch (error) {
    if (error.code === "23503") {
      return res.status(409).json({
        success: false,
        message: "This user cannot be deleted because they own a store.",
      });
    }

    next(error);
  }
};

export const getOwners = async (req, res, next) => {
  try {
    const owners = await Admin.getOwners();

    return res.status(200).json({
      success: true,
      owners,
    });
  } catch (error) {
    next(error);
  }
};

export const getStores = async (req, res, next) => {
  try {
    const stores = await Admin.getStores(req.query);

    return res.status(200).json({
      success: true,
      stores,
    });
  } catch (error) {
    next(error);
  }
};

export const getStoreById = async (req, res, next) => {
  try {
    const store = await Admin.getStoreById(req.params.id);

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

export const createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    if (!address || address.trim().length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters.",
      });
    }

    if (!ownerId) {
      return res.status(400).json({
        success: false,
        message: "Store owner is required.",
      });
    }

    const owners = await Admin.getOwners();

    const ownerExists = owners.some((owner) => owner.id === ownerId);

    if (!ownerExists) {
      return res.status(400).json({
        success: false,
        message: "Selected owner does not exist.",
      });
    }

    const store = await Admin.createStore({
      name: name.trim(),
      email: email?.trim() || null,
      address: address.trim(),
      ownerId,
    });

    return res.status(201).json({
      success: true,
      message: "Store created successfully.",
      store,
    });
  } catch (error) {
    next(error);
  }
};

export const updateStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Store name is required.",
      });
    }

    if (!address || address.trim().length > 400) {
      return res.status(400).json({
        success: false,
        message: "Address cannot exceed 400 characters.",
      });
    }

    const owners = await Admin.getOwners();

    if (!ownerId || !owners.some((owner) => owner.id === ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid store owner.",
      });
    }

    const store = await Admin.updateStore(req.params.id, {
      name: name.trim(),
      email: email?.trim() || null,
      address: address.trim(),
      ownerId,
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
    const store = await Admin.deleteStore(req.params.id);

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
    const ratings = await Admin.getRatings();

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
    const rating = await Admin.getRatingById(req.params.id);

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

export const getProfile = async (req, res, next) => {
  try {
    const admin = await Admin.getProfile(req.user.id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    next(error);
  }
};
