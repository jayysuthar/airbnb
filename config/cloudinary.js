const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verify Cloudinary configuration
console.log("Cloudinary configured with cloud name:", process.env.CLOUDINARY_CLOUD_NAME);
if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error("ERROR: Cloudinary credentials are missing! Check your .env file");
}

// Storage for property images
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "airbnb/properties",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  },
});

// Storage for PDF house rules
const pdfStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "airbnb/rules",
    allowed_formats: ["pdf"],
    resource_type: "raw", // Important for non-image files
  },
});

module.exports = { cloudinary, imageStorage, pdfStorage };
