const Campground = require("../models/campground");

// Render all campgrounds
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};

// Adds new campground ( By rendering Form) - (order matters)
module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

// Handle Post request received by (Add new campground using form)
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;

  await campground.save();
  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

// See Individual campground (order matters)
module.exports.showCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (!campground) {
    req.flash("error", "Can't find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/show", { campground });
};

// Edit each campground (Render form)
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground) {
    req.flash("error", "Can't find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

// Edit campground by PUT request (resouce/?_method=PUT)
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findByIdAndUpdate(
    id,
    {
      ...req.body.campground,
    },
    { new: true, runValidators: true }
  );
  req.flash("success", "Successfully updated campground! ");
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete campgrounds
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
