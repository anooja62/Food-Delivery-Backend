const router = require("express").Router();
const combo = require("../model/combofoodsmodel");

router.post("/add-combo", async (req, res) => {
  try {
    
    const newCombo = new combo({
      foodname: req.body.foodname,
      price:req.body.price,
      category:req.body.category,
      imgUrl: req.body.imgUrl,
      restaurantId:req.body.restaurantId
    });

    const combos = await newCombo.save();
    const allCombo = await combo.find({  restaurantId:req.body.restaurantId,
      isDeleted:0
    })
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(201).json(combos);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get(`/all-combo/:id`, async (req, res) => {
  try {
    const allCombo = await combo.find({restaurantId:req.params.id,
      isDeleted: 0,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(allCombo);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.put("/delete/:id", async (req, res) => {
  try {
    const combos = await combo.findByIdAndUpdate(req.params.id, {
      isDeleted: 1,
    });
    const allCombo = await combo.find({
      isDeleted: 0,
    });
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.status(200).json(allCombo);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
