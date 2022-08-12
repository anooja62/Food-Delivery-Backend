const router = require("express").Router();
const deliveryboy = require("../model/deliverymodel");
const bcrypt = require("bcrypt");

router.post("/delivery", async (req, res) => {
  try {
    //generate new password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new deliveryboy
    const newDeliveryboy = new deliveryboy({
      name: req.body.name,
      phone:req.body.phone,
      email: req.body.email,
      city:req.body.city,
      password: hashedPassword,
      
    });

    //save user return response

    const deliveryboys = await newDeliveryboy.save();
    res.status(201).json(deliveryboys);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});




module.exports = router;