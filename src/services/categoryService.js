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

module.exports = { createCategoryService, getCategories, getCategory };
