const router = require("express").Router();
const combo = require("../model/combofoodsmodel");

router.post("/add-combo", async (req, res) => {
  try {
    
    const newCombo = new combo({
      Items: req.body.Items,
      price:req.body.price,
      category:req.body.category,
      imgUrl: req.body.imgUrl,
    });

    const combos = await newCombo.save();
    res.status(201).json(combos);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/all-combo", async (req, res) => {
  try {
    const allCombo = await combo.find({
      isDeleted: 0,
    });

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
    res.status(200).json(allCombo);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
