const { Schema, model } = require("mongoose");
const { defaultImagePath } = require("../secret");

//name, slug, description, price, quantity, sold, shipping, image
const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name required"],
      trim: true,
      minlegth: [3, "Minimum product name length can be 3"],
    },
    slug: {
      type: String,
      required: [true, "Product slug required"],
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: [true, "Product description required"],
      trim: true,
      minlegth: [3, "Minimum product description length can be 3"],
    },
    price: {
      type: Number,
      required: [true, "Product price required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => {
          `${props.value} is not a valid price! Price must be greater than 0`;
        },
      },
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity required"],
      trim: true,
      validate: {
        validator: (v) => v > 0,
        message: (props) => {
          `${props.value} is not a valid quantity! quantity must be greater than 0`;
        },
      },
    },
    sold: {
      type: Number,
      required: [true, "Product sold required"],
      trim: true,
      default: 0,
      validate: {
        validator: (v) => v > 0,
        message: (props) => {
          `${props.value} is not a valid sold quantity! sold quantity must be greater than 0`;
        },
      },
    },
    shipping: {
      type: Number,
      default: 0, //shipping free then 0
    },
    image: {
      type: String,
      default: defaultImagePath,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

module.exports = Product;
