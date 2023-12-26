const createError = require("http-errors");
const { successResponse } = require("./responseController");
const slugify = require("slugify");
const Category = require("../models/categoryModel");
const {
  createCategoryService,
  getCategories,
  getCategory,
  updateCategory,
} = require("../services/categoryService");

// create category for Admin
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
    const category = await getCategory(slug);
    if (!category) {
      throw createError(404, "Category not found!");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "/category",
      payload: category,
    });
  } catch (error) {
    next(error);
  }
};

// update category
const handleUpdateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { slug } = req.params;
    const updatedCategory = await updateCategory(name, slug);

    if (!updatedCategory) {
      throw createError(404, "Category not found with this slug!");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "/category updated",
      payload: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleCreategory,
  handleGetCategories,
  handleGetCategory,
  handleUpdateCategory,
};
