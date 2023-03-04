const router = require("express").Router();
const FeedBack = require("../model/feedbackmodel");
const tf = require("@tensorflow/tfjs");
const Checklist = require("../model/checklistmodel");
const restaurant = require("../model/restaurantmodel");
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
const model = tf.sequential();
model.add(tf.layers.dense({ inputShape: [6], units: 1 }));
model.compile({ loss: "meanSquaredError", optimizer: "sgd" });

router.post("/train", async (req, res) => {
  const feedbackData = await FeedBack.find();
  const checklistData = await Checklist.find();

  const trainingData = feedbackData.map((feedback) => {
    const checklist = checklistData
      .filter((item) => item.restaurantId === feedback.restaurantId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestChecklist = checklist[0];
  
    return [
      Number(latestChecklist.foodPackagingSanitized === "yes"),
      Number(latestChecklist.utensilsSanitized === "yes"),
      Number(feedback.foodPackaging === "good" || feedback.foodPackaging === "excellent"),
      Number(feedback.foodQuality === "good" || feedback.foodQuality === "excellent"),
      Number(feedback.foodTaste === "good" || feedback.foodTaste === "excellent"),
      Number(latestChecklist.cleanlinessRating === 4 || latestChecklist.cleanlinessRating === 5 ? 1 : 0),
    ];
  });
  
  

  const targetData = feedbackData.map((feedback) => {
    return [
      Number(
        feedback.overallExperience === "excellent" ||
        feedback.overallExperience === "good"
      )
    ];
  });

  const xs = tf.tensor2d(trainingData);
  const ys = tf.tensor2d(targetData);

  await model.fit(xs, ys, { epochs: 100 });

  res.send("ML model trained successfully!");
});

router.get("/hygiene-prediction", async (req, res) => {
  try {
    const feedbackData = await FeedBack.find();
    const checklistData = await Checklist.find();

    const processedRestaurants = new Set();
    const restaurantData = [];

    for (const feedback of feedbackData) {
      const restaurantId = feedback.restaurantId;
      if (processedRestaurants.has(restaurantId)) {
        continue;
      }

      const checklist = checklistData
      .filter((item) => item.restaurantId === restaurantId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    const latestChecklist = checklist[0];

    const rest = await restaurant.findOne({ _id: restaurantId });


      const features = [
        Number(latestChecklist.foodPackagingSanitized === "yes"),
        Number(latestChecklist.utensilsSanitized === "yes"),
        Number(
          feedback.foodPackaging === "good" || feedback.foodPackaging === "excellent"
        ),
        Number(
          feedback.foodQuality === "good" || feedback.foodQuality === "excellent"
        ),
        Number(feedback.foodTaste === "good" || feedback.foodTaste === "excellent"),
        Number(latestChecklist.cleanlinessRating === 4 || latestChecklist.cleanlinessRating === 5 ? 1 : 0),
      ];

      const input = tf.tensor2d([features]);
      const prediction = model.predict(input);
      const predictionValue = prediction.dataSync()[0];
      console.log(predictionValue);

      let hygieneLevel = "";
      if (predictionValue < 0.2) {
        hygieneLevel = "Poor Hygiene";
      } else if (predictionValue < 0.4) {
        hygieneLevel = "Moderate Hygiene";
      } else {
        hygieneLevel = "Extremely Hygienic";
      }

      restaurantData.push({
        restaurantName: rest.name,
        address: rest.address,
        hygieneLevel,
      });

      processedRestaurants.add(restaurantId);
    }

    res.status(200).json(restaurantData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching restaurant data" });
  }
});

module.exports = router;
