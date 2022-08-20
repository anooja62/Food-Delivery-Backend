const router = require("express").Router();
const shipping = require("../model/addressmodel");

router.post("/address", async (req, res) => {
  try {
   
    //create new address
    const newShipping = new shipping({
      name: req.body.name,
      phone:req.body.phone,
      pincode: req.body.pincode,
      address:req.body.address,
      userId:req.body.userId
      
    });

    //save user return response

    const ship = await newShipping.save();
    res.status(201).json(ship);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});




module.exports = router;