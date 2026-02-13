const Home = require("../models/home");
const { cloudinary } = require("../config/cloudinary");

exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.session.user,
  });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};

exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  console.log("Form data:", houseName, price, location, rating, description);
  console.log("Files received:", JSON.stringify(req.files, null, 2));

  if (!req.files || !req.files.photo) {
    return res.status(400).send("No image provided");
  }

  try {
    // Cloudinary returns the URL in path property
    const photo = req.files.photo[0].path;

    // Store the public_id for potential deletion later
    const photoPublicId = req.files.photo[0].filename;

    console.log("Photo URL:", photo);
    console.log("Photo Public ID:", photoPublicId);

    const home = new Home({
      houseName,
      price,
      location,
      rating,
      photo,
      photoPublicId, // Store Cloudinary public_id
      description,
    });

    // Handle PDF rules if provided
    if (req.files && req.files.details) {
      home.rulesUrl = req.files.details[0].path;
      home.rulesPublicId = req.files.details[0].filename;
    }

    home.save().then((savedHome) => {
      console.log("Home Saved successfully:", savedHome._id);
      res.redirect("/host/host-home-list");
    }).catch((err) => {
      console.error("Error saving home to database:", err.message);
      console.error("Full error:", err);
      res.status(500).send("Error saving home: " + err.message);
    });
  } catch (err) {
    console.error("Error processing upload:", err.message);
    console.error("Full error:", err);
    res.status(500).send("Error processing upload: " + err.message);
  }
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      // If new photo uploaded, delete old one from Cloudinary and update
      if (req.files && req.files.photo) {
        // Delete old image from Cloudinary if exists
        if (home.photoPublicId) {
          cloudinary.uploader.destroy(home.photoPublicId, (err, result) => {
            if (err) {
              console.log("Error deleting old image from Cloudinary:", err);
            }
          });
        }
        home.photo = req.files.photo[0].path;
        home.photoPublicId = req.files.photo[0].filename;
      }

      // If new PDF rules uploaded, delete old one and update
      if (req.files && req.files.details) {
        if (home.rulesPublicId) {
          cloudinary.uploader.destroy(home.rulesPublicId, { resource_type: 'raw' }, (err, result) => {
            if (err) {
              console.log("Error deleting old PDF from Cloudinary:", err);
            }
          });
        }
        home.rulesUrl = req.files.details[0].path;
        home.rulesPublicId = req.files.details[0].filename;
      }

      home
        .save()
        .then((result) => {
          console.log("Home updated ", result);
          res.redirect("/host/host-home-list");
        })
        .catch((err) => {
          console.log("Error while updating ", err);
          res.status(500).send("Error updating home");
        });
    })
    .catch((err) => {
      console.log("Error while finding home ", err);
      res.status(500).send("Error finding home");
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete ", homeId);

  // First find the home to get Cloudinary public IDs
  Home.findById(homeId)
    .then((home) => {
      if (!home) {
        return res.status(404).send("Home not found");
      }

      // Delete image from Cloudinary if exists
      if (home.photoPublicId) {
        cloudinary.uploader.destroy(home.photoPublicId, (err) => {
          if (err) console.log("Error deleting image from Cloudinary:", err);
        });
      }

      // Delete PDF from Cloudinary if exists
      if (home.rulesPublicId) {
        cloudinary.uploader.destroy(home.rulesPublicId, { resource_type: 'raw' }, (err) => {
          if (err) console.log("Error deleting PDF from Cloudinary:", err);
        });
      }

      // Delete the home from database
      return Home.findByIdAndDelete(homeId);
    })
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
      res.status(500).send("Error deleting home");
    });
};
