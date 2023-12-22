const createError = require("http-errors");
const jwt = require("jsonwebtoken");
const { jwtAccessKey } = require("../secret");


// is logged in middleware
const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw createError(401, "access token not found!Please log in");
    }
    const decoded = jwt.verify(token, jwtAccessKey);
    if (!decoded) {
      throw createError(401, "Invalid access token!");
    }
    req.user = decoded.user;
    // console.log(decoded);
    
    next();
  } catch (error) {
    return next(error);
  }
};

// is admin middleware
const isAdmin = async (req, res, next) => {
    try {
        
      console.log(req.user.isAdmin);
      if(!req.user.isAdmin){
        throw createError(403, 'Access not allowed. You must be an admin!')
      }
      next();
    } catch (error) {
      return next(error);
    }
  };


// is logged out middleware
const isLoggedOut = async (req, res, next) => {
  try {
    const token = req.cookies.access_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtAccessKey);
        if (decoded) {
          throw createError(400, "User already logged in");
        }
      } catch (error) {
        throw error;
      }
    }
    next();
  } catch (error) {
    return next(error);
  }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };
