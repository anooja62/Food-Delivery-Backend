/** @format */

const router = require("express").Router();
const FeedBack = require("../model/feedbackmodel");

router.post("/feedback", async (req, res) => {
  const {
    userId,
    restaurantId,
  
    foodPackaging,
    foodHandling,
    foodQuality,
    foodTaste,
    overallExperience,
    currentDate,
  } = req.body;
  try {
    const newFeedback = new FeedBack({
      userId,
      restaurantId,
   
      foodPackaging,
      foodHandling,
      foodQuality,
      foodTaste,
      overallExperience,
      currentDate,
    });
    await newFeedback.save();
    res.status(201).json({ message: "Feedback saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving feedback" });
  }
});

module.exports = router;
