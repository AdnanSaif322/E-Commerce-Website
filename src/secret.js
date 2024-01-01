require("dotenv").config();

const serverPort = process.env.SERVER_PORT || 3002;

const mongoUrl = process.env.MONGOBD_ATLAS_URL;

const defaultUserImagePath =
  process.env.DEAFULT_USER_IMAGE || "public/users/users.png";

const defaultProductImagePath =
  process.env.DEAFULT_PRODUCT_IMAGE || "public/products/product.png";

const jwtActivationKey = process.env.JWT_ACTIVATION_KEY || "asd0spoi2lklsd";

const jwtAccessKey = process.env.JWT_ACCESS_KEY || "SADQWEADSAWQE";

const jwtResetPasswordKey = process.env.JWT_RESET_PASSWORD_KEY || "RESETKEY";

const jwtRefreshKey = process.env.JWT_REFRESH_KEY || "REFRESHKEY";

const smtpUsername = process.env.SMTP_USERNAME || "";

const smtpPassword = process.env.SMTP_PASSWORD || "";

const clientURL = process.env.CLIENT_URL || "";

module.exports = {
  serverPort,
  mongoUrl,
  defaultUserImagePath,
  defaultProductImagePath,
  jwtActivationKey,
  smtpUsername,
  smtpPassword,
  clientURL,
  jwtAccessKey,
  jwtResetPasswordKey,
  jwtRefreshKey,
};
