const slugify = require("slugify");
const Product = require("../models/productModel");

const createProductService = async (
  name,
  description,
  price,
  quantity,
  sold,
  shipping,
  image,
  category
) => {
  const newProduct = await Product.create({
    name: name,
    slug: slugify(name),
    description: description,
    price: price,
    quantity: quantity,
    sold: sold,
    shipping: shipping,
    image: image,
    category: category,
  });
  return newProduct;
};

const getCategories = async () => {
  return await Category.find({}).select("name slug").lean();
};
const getCategory = async (slug) => {
  return await Category.find({ slug }).select("name slug").lean();
};

const updateCategory = async (name, slug) => {
  const updateCategory = await Category.findOneAndUpdate(
    { slug },
    { $set: { name: name, slug: slugify(name) } },
    { new: true }
  );
  return updateCategory;
};

const deletecategory = async (slug) => {
  const deleteCategory = await Category.findOneAndDelete({ slug });
  return deleteCategory;
};

module.exports = {
  createProductService,
};
