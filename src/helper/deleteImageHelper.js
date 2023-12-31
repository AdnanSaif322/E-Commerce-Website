const fs = require("fs/promises");

const deleteImage = async (imagePath) => {
  try {
    await fs.access(imagePath);
    await fs.unlink(imagePath);
  } catch (error) {
    console.log("imagee does not exist or could not be deleted");
    throw error;
  }
};

module.exports = deleteImage;
