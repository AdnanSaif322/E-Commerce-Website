const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { findWithId } = require("../services/findItem");
const bcrypt = require("bcryptjs");
const deleteImage = require("../helper/deleteImageHelper");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtActivationKey, clientURL, jwtResetPasswordKey } = require("../secret");
const emailWithNodemailer = require("../helper/email");
const {
  handleUserAction,
  findUser,
  findUserById,
  deleteUserById,
  updateUserById,
  updateUserPasswordById,
} = require("../services/userService");
const fs = require("fs").promises;

// search users for Admin
const getUsers = async (req, res, next) => {
  try {
    const search = req.query.search || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const { users, count } = await findUser(search, limit, page);
    return successResponse(res, {
      statusCode: 200,
      message: "/user",
      payload: {
        users,
        pagination: {
          totalPage: Math.ceil(count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search single user for Admin
const getUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    const user = await findUserById(id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "/user",
      payload: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Delete single user
const handleDeleteUserById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const options = { password: 0 };
    await deleteUserById(id, options);

    return successResponse(res, {
      statusCode: 200,
      message: "/user deleted",
    });
  } catch (error) {
    next(error);
  }
};

// ProcessRegistger
const processRegister = async (req, res, next) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // check if user already exist in DB
    const userExist = await User.exists({ email: email });

    if (userExist) {
      throw createError(
        409,
        "User already exist with this email. Please log in!"
      );
    }

    const image = req.file.path;

    if (!image) {
      throw createError(400, "Image file is required");
    }

    if (image.size > 1024 * 1024 * 2) {
      throw createError(400, "File is too large! It must be less than 2 mb");
    }

    // create jwt
    const token = createJSONWebToken(
      { name, email, password, phone, address },
      jwtActivationKey,
      "15m"
    );

    // prepare emaill
    const emailData = {
      email,
      subject: "Account Activation Email",
      html: `
        <h2> Hello ${name} !</h2>
        <p> Please click here to <a href="${clientURL}/api/users/activate/${token}"> activate your account </a></p>
      `,
    };

    // send email with nodemailer
    try {
      await emailWithNodemailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send verification Email"));
      return;
    }

    // success message
    return successResponse(res, {
      statusCode: 200,
      message: `Please verify your email: ${email} to complete registration.`,
      payload: { token },
      // imageBufferString
    });
  } catch (error) {
    next(error);
  }
};

// Activate user Account
const activateUserAccount = async (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) throw createError(404, "token not found");

    try {
      const decoded = jwt.verify(token, jwtActivationKey);

      if (!decoded) throw createError(404, "User not verified!");

      const userExist = await User.exists({ email: decoded.email });

      if (userExist) {
        throw createError(
          409,
          "User already exist with this email. Please log in!"
        );
      }

      await User.create(decoded);

      // success message
      return successResponse(res, {
        statusCode: 201,
        message: "User was registered successfully",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw createError(401, "Token has expired!");
      } else if (error.name === "JsonWebTokenError") {
        throw createError(401, "Invalid Token!");
      } else {
        throw error;
      }
    }
  } catch (error) {
    next(error);
  }
};

// Update user by id
const handleUpdateUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const updatedUser = await updateUserById(userId, req);

    return successResponse(res, {
      statusCode: 200,
      message: "/user updated!",
      payload: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// change user status by id
const handleManageUserStatusById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const action = req.body.action;

    handleUserAction(userId, action);

    // success message
    return successResponse(res, {
      statusCode: 200,
      message: "User was " + action + " successfully!",
    });
  } catch (error) {
    next(error);
  }
};

// update user password
const handleUpdateUserPassword = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmPassword } = req.body;
    const userId = req.params.id;

    const updatedUser = await updateUserPasswordById(
      userId,
      email,
      oldPassword,
      newPassword,
      confirmPassword
    );

    // success message
    return successResponse(res, {
      statusCode: 200,
      message: "User password updated successfully!",
      payload: { updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// forget user password controller
const handleForgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const userData = await User.findOne({ email: email });
    if (!userData) {
      throw createError(404, "No user found with this email. Please register");
    }
    console.log(userData);

    // create jwt
    const token = createJSONWebToken({ email }, jwtResetPasswordKey, "15m");

    // prepare emaill
    const emailData = {
      email,
      subject: "Password Reset Email",
      html: `
        <h2> Greetings ${userData.name}!!</h2>
        <p> Please click here to <a href="${clientURL}/api/users/reset-password/${token}"> reset your account password </a></p>
      `,
    };

    // send email with nodemailer
    try {
      await emailWithNodemailer(emailData);
    } catch (emailError) {
      next(createError(500, "Failed to send reset password Email"));
      return;
    }

    // success message
    return successResponse(res, {
      statusCode: 200,
      message: `Please reset your password from your email.`,
      payload: { token },
      // imageBufferString
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getUserById,
  handleDeleteUserById,
  processRegister,
  activateUserAccount,
  handleUpdateUserById,
  handleManageUserStatusById,
  handleUpdateUserPassword,
  handleForgetPassword,
};
