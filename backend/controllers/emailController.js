
const EmailTemplate = require("../models/emailTemplate");
const cloudinary = require("../config/cloudinary");

exports.getEmailLayout = (req, res) => {
  const layout = fs.readFileSync(path.join(__dirname, "../layout.html"), "utf8");
  res.send({ layout });
};

  

exports.uploadImage = async (req, res) => {
  try {
    const filePath = req.file.path; // Path from multer or file upload library
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "email_templates",
    });

    const imageUrl = result.secure_url; // URL from Cloudinary
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};
  

exports.saveEmailTemplate = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).send({ error: "Title and content are required" });
    }

    const template = new EmailTemplate(req.body);
    await template.save();

    res.status(201).send({ message: "Template saved successfully!" });
  } catch (error) {
    console.error("Error saving template:", error);
    res.status(500).send({ error: "Failed to save template" });
  }
};


const fs = require('fs');
const path = require('path');

exports.renderAndDownloadTemplate = (req, res) => {
  const { title, content, footer, imageUrl } = req.body;

  try {
    // Read the template file
    const layoutPath = path.join(__dirname, "../layout.html");
    let layout = fs.readFileSync(layoutPath, "utf8");

    // Log the incoming data for debugging
    console.log("Rendering template with the following data:");
    console.log("Title:", title);
    console.log("Content:", content);
    console.log("Footer:", footer);
    console.log("Image URL:", imageUrl);

    // Ensure placeholders are replaced properly
    layout = layout
      .replace("{{title}}", title || "No title provided")
      .replace("{{content}}", content || "No content provided")
      .replace("{{footer}}", footer || "No footer provided")
      .replace("{{imageUrl}}", imageUrl || "No image URL provided");

    // Ensure the downloads directory exists
    const downloadsDir = path.join(__dirname, "..", "downloads");
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    // Save the rendered HTML to a file
    const outputPath = path.join(downloadsDir, "output.html");
    fs.writeFileSync(outputPath, layout);

    // Send the file for download
    res.download(outputPath, "output.html", (err) => {
      if (err) {
        console.error("Error sending file:", err);
      }
    });
  } catch (error) {
    console.error("Error rendering template:", error);
    res.status(500).send("Failed to render template");
  }
};
