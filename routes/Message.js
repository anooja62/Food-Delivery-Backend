const router = require("express").Router();

const message = require("../model/messagemodel");

router.post("/add-message", async (req, res) => {
  try {
    //create new message
    const newMessage = new message({
      restaurantname: req.body.restaurantname,
 restaurantId:req.body.restaurantId,
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
router.get(`/single-msg/:id`, async (req, res) => {
  try {
    const singleMessage = await message.findOne({ _id:req.params.id,
      isReplyed: 0,
    });

    res.status(200).json(singleMessage);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});



router.get("/all-Message", async (req, res) => {
  try {
    const allMessage = await message.find({
      isReplyed: 0,
    });

    res.status(200).json(allMessage);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.put("/reply/:id", async (req, res) => {
  try {
    const messages = await message.findByIdAndUpdate(req.params.id, {
      reply:req.body.reply,
      isReplyed: 1,
    });
    const allMessage = await message.find({
      isReplyed: 0,
    });
    res.status(200).json(allMessage);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
