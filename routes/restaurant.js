/** @format */

const router = require("express").Router();
const restaurant = require("../model/restaurantmodel");
const bcrypt = require("bcrypt");

router.post("/add-restaurent", async (req, res) => {
  try {
    const newRestaurent = new restaurant({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      imgUrl: req.body.imgUrl,
      license: req.body.license,
    });
    const restEmail = await restaurant.findOne({ email: req.body.email });
    restEmail && res.status(404).json("Email already Exist!!!");

    if (!restEmail) {
      const rest = await newRestaurent.save();
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
      );
      res.status(201).json(rest);
    }
  } catch (err) {
    res.status(500).json({ message: err });
    console.log(err);
  }
});

router.post("/rest-login", async (req, res) => {

  try {
    const rest = await restaurant.findOne({ email: req.body.email });

    if (!rest) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      rest.password
    );

    if (!validPassword) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const { password, ...others } = rest._doc;
    // res.cookie("restaurantid", others._id, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantname", others.name, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantemail", others.email, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantphone", others.phone, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantlicense", others.license, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantimgurl", others.imgUrl, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantabout", others.about, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantownername", others.ownername, { httpOnly: true, secure: true, sameSite: "none" });
    // res.cookie("restaurantownerphone", others.ownerphone, { httpOnly: true, secure: true, sameSite: "none" });
    
    res.status(200).json(others);
    
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.put("/restaurent-pw-update", async (req, res) => {
  try {
    console.log(req.body);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const rest = await restaurant.findOne({ email: req.body.email });
    const id = rest._id;

    const psw = await restaurant.findByIdAndUpdate(id, {
      password: hashedPassword,
      isApproved: 1,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(201).json("Accepted");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.put("/update-res/:id", async (req, res) => {
  try {
    let hashedPassword;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    const rest = await restaurant.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      license: req.body.license,
      about: req.body.about,

      ownername: req.body.ownername,
      ownerphone: req.body.ownerphone,
      restImg: req.body.restImg,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(201).json("updated");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get(`/res-details/:id`, async (req, res) => {
  try {
    const allRestaurent = await restaurant.find({
      restaurantId: req.params.id,
      isRejected: 0,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(allRestaurent);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.get(`/single-rest/:id`, async (req, res) => {
  try {
    const singleRestaurent = await restaurant.findOne({
      _id: req.params.id,
      isRejected: 0,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(singleRestaurent);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/all-restaurent", async (req, res) => {
  try {
    const allRestaurent = await restaurant.find({
      isRejected: 0,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(allRestaurent);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/parsed-restaurent", async (req, res) => {
  try {
    const allRestaurent = await restaurant.find({
      isRejected: 0,
    });

    let tempArr = [];

    allRestaurent.map((item) =>
      tempArr.push({ label: item.name, value: item._id, address: item.address })
    );
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(tempArr);
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
    const allRestaurent = await restaurant.find({
      isRejected: 0,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(allRestaurent);
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.get("/search/:address", async (req, res) => {
  try {
    const allRestaurants = await restaurant
      .find({
        $text: { $search: req.params.address },
      })
      .sort({ sentimentScore: -1 });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(allRestaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/restaurants/:id/sentiment-score", async (req, res) => {
  try {
    const restaurants = await restaurant.findById(req.params.id);

    if (!restaurants) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    restaurants.sentimentScore = req.body.sentimentScore;

    const updatedRestaurant = await restaurants.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.json(updatedRestaurant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/restaurants/:id/sentiment-score", async (req, res) => {
  try {
    const restaurants = await restaurant.findById(
      req.params.id,
      "sentimentScore"
    );

    if (!restaurants) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.json({ sentimentScore: restaurants.sentimentScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/sentiment-score-average", async (req, res) => {
  try {
    const restaurants = await restaurant.find({}, "sentimentScore");

    if (restaurants.length === 0) {
      return res.status(404).json({ message: "No restaurants found" });
    }

    const sentimentScores = restaurants.map((rest) => rest.sentimentScore);

    const sum = sentimentScores.reduce((acc, cur) => acc + cur, 0);

    const average = sum / sentimentScores.length;
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.json({ averageSentimentScore: average });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/top-restaurants", async (req, res) => {
  try {
    const topRestaurants = await restaurant
      .find({}, "name sentimentScore")
      .sort({ sentimentScore: -1 })
      .limit(4);
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.json(topRestaurants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
