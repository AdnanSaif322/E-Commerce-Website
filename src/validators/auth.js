const { body } = require("express-validator");
const createHttpError = require("http-errors");
// registration validation
const validateUserRegistration = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required!")
    .isLength({ min: 3, max: 31 })
    .withMessage("Name should be 3-31 characters long."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email address is not valid!"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 5 })
    .withMessage("Password should be minmun 5 characters long.")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("address")
    .trim()
    .notEmpty()
    .withMessage("Address is required!")
    .isLength({ min: 5 })
    .withMessage("Address should be minmun 5 characters long."),
  body("image").optional().isString().withMessage("Image is optional!"),
  body("phone")
  .trim()
  .notEmpty()
  .withMessage("Phone is required!")
];

// sign in validation
const validateUserLogin = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email address is not valid!"),
  body("password")
    .trim()
    .notEmpty()
    .withMessage("Password is required!")
    .isLength({ min: 5 })
    .withMessage("Password should be minmun 5 characters long.")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

// update password
const validateUserPasswordUpdate = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email address is not valid!"),
  body("newPassword")
    .trim()
    .notEmpty()
    .withMessage("New Password is required!")
    .isLength({ min: 5 })
    .withMessage("Password should be minmun 5 characters long.")
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/)
    .withMessage(
      "Password should contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
    body("confirmPassword")
    .custom((value,{req})=>{
      if(value != req.body.newPassword){
        throw new createHttpError('Password did not match!')
      }
      return true;
    }),
];

module.exports = { validateUserRegistration, validateUserLogin,validateUserPasswordUpdate };
