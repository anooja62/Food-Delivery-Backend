const router = require("express").Router();
const menu = require("../model/menumodel");

router.post("/add-menu", async (req, res) => {
  try {
    
    const newMenu = new menu({
      foodname: req.body.foodname,
      price:req.body.price,
      category:req.body.category,
      imgUrl: req.body.imgUrl,
    });

    const menus = await newMenu.save();
    res.status(201).json(menus);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/all-menu", async (req, res) => {
  try {
    const allMenu = await menu.find({
      isDeleted: 0,
    });

    res.status(200).json(allMenu);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.put("/delete/:id", async (req, res) => {
  try {
    const menus = await menu.findByIdAndUpdate(req.params.id, {
      isDeleted: 1,
    });
    const allMenu = await menu.find({
      isDeleted: 0,
    });
    res.status(200).json(allMenu);
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
