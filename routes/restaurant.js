const router = require("express").Router();
const restaurant = require("../model/restaurantmodel");
const bcrypt = require("bcrypt");

router.post("/add-restaurent", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new restaurant
    const newRestaurent = new restaurant({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      imgUrl: req.body.imgUrl,
      password:hashedPassword,
    });

    const rest = await newRestaurent.save();
    res.status(201).json(rest);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/all-restaurent", async (req, res) => {
  try {
    const allRestaturent = await restaurant.find({
      isRejected: 0,
    });

    res.status(200).json(allRestaturent);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.put("/reject/:id", async (req, res) => {
  try {
    const restaurants = await restaurant.findByIdAndUpdate(req.params.id, {
      isRejected: 1,
    });
    const allRestaturent = await restaurant.find({
      isRejected: 0,
    });
    res.status(200).json(allRestaturent);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
