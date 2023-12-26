const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategoryService = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });
  return newCategory;
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
  createCategoryService,
  getCategories,
  getCategory,
  updateCategory,
  deletecategory,
};
