const express = require("express");
const {
  getUsers,
  getUserById,
  handleDeleteUserById,
  processRegister,
  activateUserAccount,
  handleUpdateUserById,
  handleManageUserStatusById,
  handleUpdateUserPassword
} = require("../controllers/userController");
const uploadUserImage = require("../middlewares/uploadFile");
const { validateUserRegistration, validateUserPasswordUpdate } = require("../validators/auth");
const runValidation = require("../validators/index");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

const userRouter = express.Router();

// GET  /users
userRouter.post(
  "/process-register",
  isLoggedOut,
  uploadUserImage.single("image"),
  validateUserRegistration,
  runValidation,
  processRegister
); //register user
userRouter.post("/acitave", isLoggedOut, activateUserAccount);  //verify new account
userRouter.get("/", isLoggedIn, isAdmin, getUsers);  //get all users
userRouter.get("/:id", isLoggedIn, isAdmin, getUserById);  //get single user
userRouter.delete("/:id", isLoggedIn, isAdmin, handleDeleteUserById); //delete single user
userRouter.put("/update-password/:id", isLoggedIn,validateUserPasswordUpdate,runValidation, handleUpdateUserPassword); //update user password

userRouter.put(
  "/:id",
  isLoggedIn,
  uploadUserImage.single("image"),
  handleUpdateUserById
);  //update user information

userRouter.put(
  "/manage-user/:id",
  isLoggedIn,
  isAdmin,
  handleManageUserStatusById
); //manage user status ban/unban

module.exports = userRouter;
