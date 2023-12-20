const createHttpError = require("http-errors");
const User = require("../models/userModel");
const deleteImage = require("../helper/deleteImageHelper");
const bcrypt = require("bcryptjs");
const { jwtResetPasswordKey, clientURL } = require("../secret");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const emailWithNodemailer = require("../helper/email");

// find all user for admin Service
const findUser = async (search, limit, page) => {
  try {
    const searchRegEx = new RegExp(".*" + search + ".*", "i");

    const filter = {
      isAdmin: { $ne: true },
      $or: [
        { name: { $regex: searchRegEx } },
        { email: { $regex: searchRegEx } },
        { phone: { $regex: searchRegEx } },
      ],
    };

    const options = { password: 0 };

    const users = await User.find(filter, options)
      .limit(limit)
      .skip((page - 1) * limit);

    const count = await User.find(filter).countDocuments();

    if (!users) {
      throw createHttpError(404, "User not found!");
    }
    return { users, count };
  } catch (error) {
    throw error;
  }
};

// find single user by id for admin Service
const findUserById = async (id, options = {}) => {
  try {
    const user = await User.findById(id, options);

    if (!user) {
      throw createHttpError(404, "User not found");
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// delete single user by id for admin Service
const deleteUserById = async (id, options = {}) => {
  try {
    const user = await User.findByIdAndDelete({
      _id: id,
      isAdmin: false,
    });
    // console.log(user.image);
    const image = req.file?.path;
    const imagePath = user.image;
    // if(user && user.image){
    //   await deleteImage(imagePath);
    // }
    deleteImage(imagePath);
  } catch (error) {
    throw error;
  }
};

// update user information
const updateUserById = async (userId, req) => {
  try {
    const options = { password: 0 };
    const user = await findUserById(userId, options);
    const updateOptions = { new: true, runValidators: true, context: "query" };
    let updates = {};

    for (let key in req.body) {
      if (["name", "password", "phone", "address"].includes(key)) {
        updates[key] = req.body[key];
      } else if (["email"].includes(key)) {
        throw createError("Email can not be updated!");
      }
    }

    const image = req.file?.path;
    if (image) {
      if (image.size > 1024 * 1024 * 2) {
        throw createError(
          400,
          "File size is too large! It must be less than 2 MB"
        );
      }
      updates.image = image;
      const imagePath = user.image;
      // imagePath!== "default.jpg" && deleteImage(imagePath);
      deleteImage(imagePath);
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(404, "User with this ID does not exist!");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

//
const updateUserPasswordById = async (
  userId,
  email,
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw createHttpError(404, "User not found with this email.");
    }

    if (!newPassword === confirmPassword) {
      throw createHttpError(
        400,
        "New password did not match with confirm password"
      );
    }
    // compare password
    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);
    console.log("password match");

    if (!isPasswordMatch) {
      throw createError(401, "Old password did not match! Please try again");
    }

    const updates = { $set: { password: newPassword } };
    const updateOptions = { new: true };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      updateOptions
    ).select("-password");

    if (!updatedUser) {
      throw createError(400, "Failed to update password");
    }
    return updatedUser;
  } catch (error) {
    throw error;
  }
};

// manage user status service
const handleUserAction = async (userId, action) => {
  try {
    let update;
    if (action == "ban") {
      update = { isBanned: true };
    } else if (action == "unban") {
      update = { isBanned: false };
    } else {
      throw createError(400, 'Invalid action. User "ban" or "unban"');
    }

    const updateOptions = { new: true, runValidators: true, context: "query" };

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      update,
      updateOptions
    ).select("-password");

    if (update == "ban") {
      throw createError(400, "User  banned successfully!");
    } else if (update == "unban") {
      throw createHttpError(400, "User  unbanned successfully!");
    }
  } catch (error) {
    throw error;
  }
};

// manage user status service
const forgetPassword = async (email) => {
  try {
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
      throw createHttpError(400, "failed to send reset password email");
      // next(createHttpError(500, "Failed to send reset password Email"));
      return;
    }

    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  findUser,
  findUserById,
  deleteUserById,
  updateUserById,
  updateUserPasswordById,
  handleUserAction,
  forgetPassword,
};
