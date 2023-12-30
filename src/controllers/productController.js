const createError = require("http-errors");
const { successResponse } = require("./responseController");
const {
  createProductService,
  getProducts,
} = require("../services/productService");
const Product = require("../models/productModel");

// create category for Admin
const handleProduct = async (req, res, next) => {
  try {
    const { name, description, price, quantity, shipping, category } = req.body;

    const image = req.file?.path;

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
const handleGetProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const productsData = await getProducts(page, limit);

    return successResponse(res, {
      statusCode: 200,
      message: "/products",
      payload: {
        products: productsData.products,
        pagination: {
          totalPage: Math.ceil(productsData.count / limit),
          currentPage: page,
          previousPage: page - 1 > 0 ? page - 1 : null,
          nextPage:
            page + 1 <= Math.ceil(productsData.count / limit) ? page + 1 : null,
        },
      },
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
  handleGetProducts,
};
