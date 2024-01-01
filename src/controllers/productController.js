const createError = require("http-errors");
const { successResponse } = require("./responseController");
const {
  createProductService,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
} = require("../services/productService");
const Product = require("../models/productModel");
const deleteImage = require("../helper/deleteImageHelper");

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
const handleGetProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    // const slug = slugify(name);
    const product = await getProduct(slug);
    if (!product) {
      throw createError(404, "Category not found!");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "/product",
      payload: product,
    });
  } catch (error) {
    next(error);
  }
};

// update category
const handleUpdateProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const updateOptions = { new: true, runvalidators: true, context: "query" };
    let updates = {};

    const allowedFields = [
      "name",
      "description",
      "price",
      "sold",
      "quantity",
      "shipping",
    ];
    for (const key in req.body) {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    }

    const updatedProduct = await updateProduct(slug, updates, updateOptions);

    if (!updatedProduct) {
      throw createError(404, "Product not found with this slug!");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "/product updated",
      payload: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// delete category
const handleDeleteProduct = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const deletedProducts = await deleteProduct(slug);

    if (!deletedProducts) {
      throw createError(404, "Product not found with this slug!");
    }
    return successResponse(res, {
      statusCode: 200,
      message: "/category deleted",
      payload: deletedProducts,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  handleProduct,
  handleGetProducts,
  handleGetProduct,
  handleDeleteProduct,
  handleUpdateProduct,
};
