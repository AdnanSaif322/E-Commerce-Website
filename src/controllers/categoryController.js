const createError = require("http-errors");
const { successResponse } = require("./responseController");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const {
  createCategoryService,
  getCategories,
  getCategory,
} = require("../services/categoryService");

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

// get all categories
const handleGetCategories = async (req, res, next) => {
  try {
    const categories = await getCategories();
    return successResponse(res, {
      statusCode: 200,
      message: "/categories",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

// single category
const handleGetCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    // const slug = slugify(name);
    const categories = await getCategory(slug);
    return successResponse(res, {
      statusCode: 200,
      message: "/category",
      payload: categories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreategory,
  handleGetCategories,
  handleGetCategory,
};
