// Load environment variables
require("dotenv").config();

// Core Module
const path = require("path");

// External Module
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const multer = require("multer");
const { mongoose } = require("mongoose");

// Cloudinary configuration
const { imageStorage, pdfStorage } = require("./config/cloudinary");

const MONGO_DB_URL =
  process.env.MONGODB_URI ||
  "mongodb+srv://root:root1835@pjnode.gsxhisp.mongodb.net/airbnb?appName=PJNode";

//Local Module
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");
const rootDir = require("./utils/pathUtil");
const errorsController = require("./controllers/errors");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const store = new MongoDBStore({
  uri: MONGO_DB_URL,
  collection: "sessions",
});

// Combined storage handler that routes to correct Cloudinary folder
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("./config/cloudinary");

const combinedStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    if (file.fieldname === "photo") {
      return {
        folder: "airbnb/properties",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
        transformation: [{ width: 1000, height: 1000, crop: "limit" }],
      };
    } else if (file.fieldname === "details") {
      return {
        folder: "airbnb/rules",
        allowed_formats: ["pdf"],
        resource_type: "raw",
      };
    }
  },
});

// File filter for validating file types
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "photo") {
    // Only allow images for photo (including WebP)
    if (["image/jpeg", "image/png", "image/jpg", "image/webp"].includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else if (file.fieldname === "details") {
    // Only allow PDF for rules
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  } else {
    cb(null, false);
  }
};

app.use(express.urlencoded());
app.use(
  multer({ storage: combinedStorage, fileFilter }).fields([
    { name: "photo", maxCount: 1 },
    { name: "details", maxCount: 1 },
  ]),
);

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.error("Multer error:", err.message);
    return res.status(400).send("File upload error: " + err.message);
  } else if (err) {
    console.error("Upload error:", err.message);
    console.error("Full error:", err);
    return res.status(500).send("Upload error: " + err.message);
  }
  next();
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "PJ Node learning",
    resave: false,
    saveUninitialized: true,
    store: store,
  }),
);

app.use((req, res, next) => {
  req.isLoggedIn = req.session.isLoggedIn;
  next();
});

app.use(authRouter);
app.use(storeRouter);
app.use("/host", (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect("/login");
  }
  next();
});
app.use("/host", hostRouter);

app.use(express.static(path.join(rootDir, "public")));
// No longer needed - files served from Cloudinary
// app.use("/uploads", express.static(path.join(rootDir, "uploads")));
// app.use("/rules", express.static(path.join(rootDir, "rules")));
// app.use("/host/uploads", express.static(path.join(rootDir, "uploads")));
// app.use("/homes/uploads", express.static(path.join(rootDir, "uploads")));

app.use(errorsController.pageNotFound);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGO_DB_URL, {
    tls: true,
  })
  .then(() => {
    console.log("Connected to MongoDB via Mongoose");
    app.listen(PORT, () => {
      console.log(`Server running on address http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB", err);
  });
