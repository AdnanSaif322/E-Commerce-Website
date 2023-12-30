const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const {
  UPLOAD_USER_IMG_DIRECTORY,
  ALLOWED_FILE_TYPE,
  MAX_FILE_SIZE,
  UPLOAD_PRODUCT_IMG_DIRECTORY,
} = require("../config");
const { error } = require("console");

const userStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_USER_IMG_DIRECTORY);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const productStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_PRODUCT_IMG_DIRECTORY);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  // const extname = path.extname(file.originalname);
  if (!ALLOWED_FILE_TYPE.includes(file.mimetype)) {
    return cb(new Error("File type not allowed"), false);
  }
  cb(null, true);
};

const uploadUserImage = multer({
  storage: userStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadProductImage = multer({
  storage: productStorage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

module.exports = { uploadUserImage, uploadProductImage };
