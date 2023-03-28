/** @format */

const router = require("express").Router();
const shipping = require("../model/addressmodel");

router.post("/address", async (req, res) => {
  try {
    //create new address
    const newShipping = new shipping({
      label: req.body.label,
      name: req.body.name,
      phone: req.body.phone,
      pincode: req.body.pincode,
      address: req.body.address,
      userId: req.body.userId,
    });
    const ship = await newShipping.save();
    //save user return response
    const allShipping = await shipping.find({
      userId: req.body.userId,
      isDeleted: 0,
    });
  
    res.status(201).json(allShipping);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get(`/all-addresses/:id`, async (req, res) => {
  try {
    const allShipping = await shipping.find({
      userId: req.params.id,
      isDeleted: 0,
    });
 
    res.status(200).json(allShipping);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.put("/delete/:id", async (req, res) => {
  try {
    const ship = await shipping.findByIdAndUpdate(req.params.id, {
      isDeleted: 1,
    });
    const allShipping = await shipping.find({
      isDeleted: 0,
    });
 
    res.status(200).json(allShipping);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
