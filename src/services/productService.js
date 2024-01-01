const slugify = require("slugify");
const Product = require("../models/productModel");
const createError = require("http-errors");
const deleteImage = require("../helper/deleteImageHelper");

const createProductService = async (
  name,
  description,
  price,
  quantity,
  shipping,
  image,
  category
) => {
  const productExists = await Product.exists({ name: name });
  if (productExists) {
    throw createError(404, "Product already exist!");
  }

  if (image && image.size > 1024 * 1024 * 2) {
    throw createError(400, "File is too large! It must be less than 2 mb");
  }

  const newProduct = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    shipping: shipping,
    image: image,
    category: category,
  });
  return newProduct;
};

const getProducts = async (page, limit) => {
  const products = await Product.find({})
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  if (!products) throw createError(404, "No product found");
  const count = await Product.find({}).countDocuments();
  return { products, count };
};

const getProduct = async (slug) => {
  return await Product.findOne({ slug });
};

const updateProduct = async (slug, updates, updateOptions) => {
  if (updates.name) {
    updates.slug = slugify(updates.name);
  }

  const updatedProduct = await Product.findOneAndUpdate(
    { slug },
    updates,
    updateOptions
  );
  return updatedProduct;
};

const deleteProduct = async (slug) => {
  const deleteProducts = await Product.findOneAndDelete({ slug });
  if (deleteProducts && deleteProducts.image) {
    await deleteImage(deleteProducts.image);
  }
  return deleteProducts;
};

module.exports = {
  createProductService,
  getProducts,
  getProduct,
  deleteProduct,
  updateProduct,
};
