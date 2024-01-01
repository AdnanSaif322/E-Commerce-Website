const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");
const { defaultUserImagePath } = require("../secret");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlegth: [3, "Minimum character length can be 3"],
      maxlegth: [31, "Maximum character length can be 31"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.−]?\w+)*@\w+([\.−]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email!",
      },
    },
    password: {
      type: String,
      required: true,
      minlegth: [6, "Minimum character length can be 6"],
      set: (v) => bcrypt.hashSync(v, bcrypt.genSaltSync(10)),
    },
    image: {
      type: String,
      default: defaultUserImagePath,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = model("Users", userSchema);

module.exports = User;
