const router = require("express").Router();

const message = require("../model/messagemodel");

router.post("/add-message", async (req, res) => {
  try {
    //create new message
    const newMessage = new message({
      restaurantname: req.body.restaurantname,

      requestFor: req.body.requestFor,
      msg: req.body.msg,
    });

    const msg = await newMessage.save();
    res.status(201).json(msg);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


module.exports = router;
