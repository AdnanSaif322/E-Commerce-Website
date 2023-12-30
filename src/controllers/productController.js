const createError = require("http-errors");
const { successResponse } = require("./responseController");
const { createProductService } = require("../services/productService");

// create category for Admin
const handleProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;

    const image = req.file?.path;

    if (image && image.size > 1024 * 1024 * 2) {
      throw createError(400, "File is too large! It must be less than 2 mb");
    }
    const newProduct = await createProductService(
      name,
      description,
      price,
      quantity,
      shipping,
      image,
      category
    );

    // success message
    return successResponse(res, {
      statusCode: 201,
      message: "Category was created successfully",
      payload: newProduct,
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

// delete category
const handleDeleteCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deleteCategory = await deletecategory(slug);

    if (!deleteCategory) {
      throw createError(404, "Category not found with this slug!");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "/category deleted",
      payload: deleteCategory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleProduct,
};
