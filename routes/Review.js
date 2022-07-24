const router = require("express").Router();
const review = require("../model/reviewmodel");


router.post("/review", async (req, res) => {
    try {
      
      //create new user
      const newUser = new user({
        name: req.body.name,
       
        review:req.body.review,
      });

      const reviews = await newReview.save();
      res.status(201).json(users);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  });


    module.exports = router;