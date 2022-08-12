const router = require("express").Router();
const foodreview = require("../model/reviewmodel");


router.post("/review", async (req, res) => {
  try {
   
    //create new food review
    const newFoodreview = new foodreview({
      name: req.body.name,
      description:req.body.description,
      
      
    });

    //save user return response

    const foodreviews = await newFoodreview.save();
    res.status(201).json(foodreviews);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});




module.exports = router;