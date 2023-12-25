const slugify = require("slugify");
const Category = require("../models/categoryModel");

const createCategoryService = async (name) => {
  const newCategory = await Category.create({
    name: name,
    slug: slugify(name),
  });
  return newCategory;
};

module.exports = { createCategoryService };
