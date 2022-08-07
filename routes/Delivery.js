const router = require("express").Router();
const user = require("../model/deliverymodel");
const bcrypt = require("bcrypt");

router.post("/delivery", async (req, res) => {
  try {
    //generate new password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new user({
      name: req.body.name,
      phone:req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      
    });

    //save user return response

    const users = await newUser.save();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});








module.exports = router;