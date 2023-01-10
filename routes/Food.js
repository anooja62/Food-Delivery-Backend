/** @format */

const router = require("express").Router();
const menu = require("../model/menumodel");

router.post("/add-menu", async (req, res) => {
  try {
    const newMenu = new menu({
      foodname: req.body.foodname,
      price: req.body.price,
      category: req.body.category,
      imgUrl: req.body.imgUrl,
      restaurantId: req.body.restaurantId,
    });

    const menus = await newMenu.save();
    const allMenu = await menu.find({
      restaurantId: req.body.restaurantId,
      isDeleted: 0,
      
    });

    res.status(201).json(menus);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.get(`/single-menu/:id`, async (req, res) => {
  try {
    const singleMenu = await menu.findOne({ _id: req.params.id, isDeleted: 0 });

    res.status(200).json(singleMenu);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.get(`/all-menu/:id`, async (req, res) => {
  try {
    const allMenu = await menu.find({
      restaurantId: req.params.id,
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
router.put("/available/:id", async (req, res) => {
  try {
    const menus = await menu.findByIdAndUpdate(req.params.id, {
      isAvailable: 1,
    });
    const allMenu = await menu.find({
      isAvailable: 0,
    });
    res.status(200).json(allMenu);
  } catch (err) {
    return res.status(500).json(err);
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    if (req.body.imgUrl) {
      const menus = await menu.findByIdAndUpdate(req.params.id, {
        foodname: req.body.foodname,
        price: req.body.price,
        category: req.body.category,
        imgUrl: req.body.imgUrl,
      });
      console.log(menus);
    } else {
      const menus = await menu.findByIdAndUpdate(req.params.id, {
        foodname: req.body.foodname,
        price: req.body.price,
        category: req.body.category,
      });
    }

    res.status(200).json("updated");
  } catch (err) {
    return res.status(500).json(err);
  }
});

module.exports = router;
