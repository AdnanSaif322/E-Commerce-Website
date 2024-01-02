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

const getProducts = async (filter = {}, page, limit) => {
  const products = await Product.find(filter)
    .populate("category")
    .skip((page - 1) * limit)
    .limit(limit)
    .sort({ createdAt: -1 });
  if (!products) throw createError(404, "No product found");
  const count = await Product.find(filter).countDocuments();
  return { products, count };
};

const getProduct = async (slug) => {
  return await Product.findOne({ slug });
};

const updateProduct = async (slug, image, req) => {
  const product = await Product.findOne({ slug: slug });
  if (!product) {
    throw createError(404, "Product not found with this slug");
  }
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
      if (key === "name") {
        updates.slug = slugify(req.body[key]);
      }
      updates[key] = req.body[key];
    }
  }

  if (image) {
    if (image.size > 1024 * 1024 * 2) {
      throw new Error("File too large. It must be less than 2 MB");
    }
    updates.image = image;
    console.log(product.image);
    await deleteImage(product.image);
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
    console.log(deleteProducts.image);

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
