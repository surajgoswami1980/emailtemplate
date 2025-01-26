const cloudinary = require("cloudinary").v2;
require("dotenv").config();
// Ensure environment variables are loaded
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.error("Missing Cloudinary environment variables");
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });
}


module.exports = cloudinary;
