const fs = require("fs").promises;

const deleteImage = async (userImagePath) => {
  try {
    await fs.access(userImagePath);
    await fs.unlink(userImagePath);
    console.log("User image was deleted.");
  } catch (err) {
    console.log("User image does not exist!");
  }
};

module.exports = { deleteImage };
