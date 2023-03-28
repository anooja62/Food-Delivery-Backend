/** @format */

const router = require("express").Router();
const foodreview = require("../model/reviewmodel");

router.post("/review", async (req, res) => {
  try {
    const newFoodreview = new foodreview({
      name: req.body.name,
      description: req.body.description,
      restaurantId: req.body.restaurantId,
    });

    const foodreviews = await newFoodreview.save();
    const allFoodreview = await foodreview.find({
      restaurantId: req.body.restaurantId,
      isApproved: 0,
    });
  
    res.status(201).json(allFoodreview);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get(`/all-foodreview/:id`, async (req, res) => {
  try {
    const allFoodreview = await foodreview.find({
      restaurantId: req.params.id,
      isApproved: 0,
    });
  
    res.status(200).json(allFoodreview);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

module.exports = router;
