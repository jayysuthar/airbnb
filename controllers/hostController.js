const Home = require("../models/home");
const fs = require("fs");

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
  console.log(houseName, price, location, rating, description);
  console.log(req.files);

  if (!req.files || !req.files.photo) {
    return res.status(400).send("No image provided");
  }

  const photo = req.files.photo[0].path;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });

  home.save().then((savedHome) => {
    console.log("Home Saved successfully");

    // If PDF rules provided, save with homeId as filename
    if (req.files && req.files.details) {
      const fs = require("fs");
      const path = require("path");
      const oldPath = req.files.details[0].path;
      const newPath = path.join("rules", `${savedHome._id}.pdf`);
      fs.rename(oldPath, newPath, (err) => {
        if (err) console.log("Error renaming PDF:", err);
      });
    }
  });

  res.redirect("/host/host-home-list");
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

      if (req.files && req.files.photo) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting file", err);
          }
        });
        home.photo = req.files.photo[0].path;
      }

      home
        .save()
        .then((result) => {
          console.log("Home updated ", result);

          // If PDF rules provided, save/overwrite with homeId as filename
          if (req.files && req.files.details) {
            const fs = require("fs");
            const path = require("path");
            const oldPath = req.files.details[0].path;
            const newPath = path.join("rules", `${id}.pdf`);
            fs.rename(oldPath, newPath, (err) => {
              if (err) console.log("Error renaming PDF:", err);
            });
          }
        })
        .catch((err) => {
          console.log("Error while updating ", err);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while finding home ", err);
    });
};

exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Came to delete ", homeId);
  Home.findByIdAndDelete(homeId)
    .then(() => {
      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting ", error);
    });
};
