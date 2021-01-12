const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campground({
      author: "5ff81125c00cdf1c838b8b1b",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur, molestias. Sed ipsa accusantium aut in alias est natus cum corrupti molestias quas! Lorem ipsum dolor sit amet consectetur adipisicing elit. Quam quis necessitatibus cupiditate ullam fugiat. Voluptatum quis assumenda, ea nisi dolor vel, voluptatem voluptatibus sint at nostrum suscipit sequi officia? Quis! Consequatur, et dolores!",
      price,
      images: [
        {
          url:
            "https://res.cloudinary.com/dbpvoqq6h/image/upload/v1610438344/YelpCamp/gvsp13rgdtpf5sbqsspe.png",
          filename: "YelpCamp/gvsp13rgdtpf5sbqsspe",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
