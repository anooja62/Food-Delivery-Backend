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
//restaurant login
router.post("/rest-login", async (req, res) => {
  try {
    const rest = await restaurant.findOne({ email: req.body.email });
    !rest && res.status(404).json("User not found");



    if (rest) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        rest.password
      );
      !validPassword && res.status(400).json("wrong password");
      if (validPassword) {
        const { password, ...others } = rest._doc;
        res.status(200).json(others);
      }
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
});

router.put("/restaurent-pw-update", async (req, res) => {

  try {
    console.log(req.body)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // update pw restaurant
    const rest = await restaurant.findOne({ email: req.body.email })
    const id = rest._id
console.log(rest._id)
    const psw = await restaurant.findByIdAndUpdate(id, {
      password:hashedPassword,
    });
    res.status(201).json(psw);
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
