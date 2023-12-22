const createError = require("http-errors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { successResponse } = require("./responseController");
const { createJSONWebToken } = require("../helper/jsonwebtoken");
const { jwtAccessKey, jwtRefreshKey } = require("../secret");

const handleLogin = async (req, res, next) => {
  try {
    // email,password req.body
    const { email, password } = req.body;

    // isExist
    const user = await User.findOne({ email });

    if (!user) {
      throw createError(404, "User does not exist with this email!");
    }
    // compare the password
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw createError(401, "Email/password does not match!");
    }
    // isBanned
    if (user.isBanned) {
      throw createError(403, "Your account has been suspended!");
    }
    // token, cookie

    // create jwt
    const accessToken = createJSONWebToken({ user }, jwtAccessKey, "5m");
    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 1000, //15 minutes
      httpOnly: true,
      sameSite: "none",
    });

    // create refresh token
    const refreshToken = createJSONWebToken({ user }, jwtRefreshKey, "7d");
    res.cookie("refreshToken", refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, //7 day
      httpOnly: true,
      sameSite: "none",
    });

    const userWithoutPassword = await User.findOne({ email }).select(
      "-password"
    );

    // success response
    return successResponse(res, {
      statusCode: 200,
      message: "user logged in successfully!",
      payload: { userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
};

const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // success response
    return successResponse(res, {
      statusCode: 200,
      message: "user log out successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// handle refresh token
const handleRefreshToken = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    // verify the old refresh token
    const decodedToken = jwt.verify(oldRefreshToken, jwtRefreshKey);

    if (!decodedToken) {
      throw createError(401, "Invalid refresh token. Please log in again!");
    }

    // create jwt
    const accessToken = createJSONWebToken(
      decodedToken.user,
      jwtAccessKey,
      "5m"
    );
    res.cookie("accessToken", accessToken, {
      maxAge: 5 * 60 * 1000, //15 minutes
      httpOnly: true,
      sameSite: "none",
    });

    // success response
    return successResponse(res, {
      statusCode: 200,
      message: "New access token generated!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

// handle protected route
const handleProtectedRoute = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    // verify the old refresh token
    const decodedToken = jwt.verify(accessToken, jwtAccessKey);

    if (!decodedToken) {
      throw createError(401, "Invalid access token. Please log in again!");
    }

    // success response
    return successResponse(res, {
      statusCode: 200,
      message: "Proteced resources match successfully!",
      payload: {},
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
  handleProtectedRoute,
};
