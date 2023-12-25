const createError = require("http-errors");
const { successResponse } = require("./responseController");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const { createCategoryService } = require("../services/categoryService");

// search users for Admin
const handleCreategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const newCategory = await createCategoryService(name);

    // success message
    return successResponse(res, {
      statusCode: 201,
      message: "Category was created successfully",
      payload: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreategory,
};
