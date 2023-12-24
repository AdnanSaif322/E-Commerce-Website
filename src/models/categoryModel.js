const { Schema, model } = require("mongoose");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name required"],
      trim: true,
      unique: true,
      minlegth: [3, "Minimum category length can be 3"],
    },
    slug: {
      type: String,
      required: [true, "Category slug required"],
      lowercase: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Category = model("Category", categorySchema);

module.exports = Category;
