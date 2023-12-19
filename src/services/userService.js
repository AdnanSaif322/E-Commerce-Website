const createHttpError = require("http-errors");
const User = require("../models/userModel");
const deleteImage = require("../helper/deleteImageHelper");

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
const updateUserById = async (userId,req) => {
  try {
    const options = { password: 0 };    
    const user = await findUserById( userId, options);
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

module.exports = {
  findUser,
  findUserById,
  deleteUserById,
  updateUserById,
  handleUserAction,
};
