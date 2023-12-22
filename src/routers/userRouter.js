const express = require("express");
const {
  handleGetUsers,
  handleGetUserById,
  handleDeleteUserById,
  handleProcessRegister,
  handleActivateUserAccount,
  handleUpdateUserById,
  handleManageUserStatusById,
  handleUpdateUserPassword,
  handleForgetPassword,
  handleResetPassword,
} = require("../controllers/userController");
const uploadUserImage = require("../middlewares/uploadFile");
const {
  validateUserRegistration,
  validateUserPasswordUpdate,
  validateUserForgetPassword,
  validateUserResetPassword,
} = require("../validators/auth");
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
  handleProcessRegister
); //register user
userRouter.post("/acitave", isLoggedOut, handleActivateUserAccount); //verify new account
userRouter.get("/", isLoggedIn, isAdmin, handleGetUsers); //get all users
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, handleGetUserById); //get single user
userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, isAdmin, handleDeleteUserById); //delete single user
userRouter.put(
  "/reset-Password",
  validateUserResetPassword,
  runValidation,
  handleResetPassword
); //reset user password
userRouter.put(
  "/update-password/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  validateUserPasswordUpdate,
  runValidation,
  handleUpdateUserPassword
); //update user password

userRouter.put(
  "/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  uploadUserImage.single("image"),
  handleUpdateUserById
); //update user information

userRouter.put(
  "/manage-user/:id([0-9a-fA-F]{24})",
  isLoggedIn,
  isAdmin,
  handleManageUserStatusById
); //manage user status ban/unban

userRouter.post(
  "/forget-Password",
  validateUserForgetPassword,
  runValidation,
  handleForgetPassword
); //forget user password

module.exports = userRouter;
