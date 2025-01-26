const express = require("express");
const multer = require("multer");
const EmailTemplate = require("../models/emailTemplate");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
// const express = require("express");
// const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const multer = require("multer");
// const cloudinary = require("../config/cloudinary");
// const { uploadImage } = require("../controllers/emailController");
// const { uploadImage, saveEmailTemplate } = require("../controllers/emailController");
const {
  getEmailLayout,
  uploadImage,
  saveEmailTemplate,
  renderAndDownloadTemplate,
} = require("../controllers/emailController");

const router = express.Router();

// Multer Configuration
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "email_templates", // Folder in your Cloudinary account
      allowed_formats: ["jpeg", "png", "jpg"],
    },
  });
const upload = multer({ storage });

router.get("/layout", getEmailLayout);
router.post("/upload-image", upload.single("image"), uploadImage);

router.post("/save-template", saveEmailTemplate);
router.post("/render-download", renderAndDownloadTemplate);
// In emailRoutes.js

router.get("/templates", async (req, res) => {
    try {
      const templates = await EmailTemplate.find();
      res.status(200).json(templates);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch templates" });
    }
  });

  




  
//   const upload = multer({ storage });
  
  // Routes


module.exports = router;
