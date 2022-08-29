const router = require("express").Router();
const restaurant = require("../model/restaurantmodel");
const bcrypt = require("bcrypt");

router.post("/add-restaurent", async (req, res) => {
  try {
    
    //create new restaurant
    const newRestaurent = new restaurant({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      imgUrl: req.body.imgUrl,
     
     
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
    // update pwd restaurant
    const rest = await restaurant.findOne({ email: req.body.email })
    const id = rest._id

    const psw = await restaurant.findByIdAndUpdate(id, {
      password:hashedPassword,
      
    });
    res.status(201).json(psw);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

//UPDATE restaurant

router.put("/update-res/:id", async (req, res) => {
  try {
    //generate new password
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
      license:req.body.license,
      about:req.body.about,
      issuedate:req.body.issuedate,
      expiredate:req.body.expiredate,
      licensetype:req.body.licensetype,
      ownername:req.body.ownername,
      ownerphone:req.body.ownerphone,

    });

    //save user return response

    res.status(201).json("updated");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

 //get resturant details
 router.get(`/res-details/:id`, async (req, res) => {
  try {
    const allRestaurent = await restaurant.find({ restaurantId:req.params.id,
      isRejected: 0,
    });

    res.status(200).json(allRestaurent);
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

    res.status(200).json(allRestaurent);
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
    res.status(200).json(allRestaurent);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;