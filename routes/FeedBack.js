/** @format */

const router = require("express").Router();
const FeedBack = require("../model/feedbackmodel");
const tf = require("@tensorflow/tfjs");
const Checklist = require("../model/checklistmodel");
const restaurant = require("../model/restaurantmodel");
const Order = require("../model/ordersmodel");

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
    orderId,
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
      orderId,
    });
    await newFeedback.save();
    console.log("updating order...");
    await Order.findOneAndUpdate(
      { _id: orderId },
      { isReviewed: true },
      { new: true }
    );
    console.log("order updated successfully");
  
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
      Number(latestChecklist?.foodPackagingSanitized === "yes"),

      Number(latestChecklist.utensilsSanitized === "yes"),
      Number(
        feedback.foodPackaging === "good" ||
          feedback.foodPackaging === "excellent"
      ),
      Number(
        feedback.foodQuality === "good" || feedback.foodQuality === "excellent"
      ),
      Number(
        feedback.foodTaste === "good" || feedback.foodTaste === "excellent"
      ),
      Number(
        latestChecklist.cleanlinessRating === 4 ||
          latestChecklist.cleanlinessRating === 5
          ? 1
          : 0
      ),
    ];
  });

  const targetData = feedbackData.map((feedback) => {
    return [
      Number(
        feedback.overallExperience === "excellent" ||
          feedback.overallExperience === "good"
      ),
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

    const restaurantFeedbackCounts = {};

    
    feedbackData.forEach((feedback) => {
      const restaurantId = feedback.restaurantId;
      if (restaurantFeedbackCounts[restaurantId]) {
        restaurantFeedbackCounts[restaurantId]++;
      } else {
        restaurantFeedbackCounts[restaurantId] = 1;
      }
    });

    const processedRestaurants = new Set();
    const restaurantData = [];

    
    for (const feedback of feedbackData) {
      const restaurantId = feedback.restaurantId;
      if (
        processedRestaurants.has(restaurantId) ||
        restaurantFeedbackCounts[restaurantId] < 3
      ) {
        continue;
      }

      const checklist = checklistData
        .filter((item) => item.restaurantId === restaurantId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      const latestChecklist = checklist[0];

      const rest = await restaurant.findOne({ _id: restaurantId });

      const features = [
        Number(latestChecklist?.foodPackagingSanitized === "yes"),

        Number(latestChecklist?.utensilsSanitized === "yes"),
        Number(
          feedback.foodPackaging === "good" ||
            feedback.foodPackaging === "excellent"
        ),
        Number(
          feedback.foodQuality === "good" ||
            feedback.foodQuality === "excellent"
        ),
        Number(
          feedback.foodTaste === "good" || feedback.foodTaste === "excellent"
        ),
        Number(
          latestChecklist?.cleanlinessRating === 4 ||
            latestChecklist?.cleanlinessRating === 5
            ? 1
            : 0
        ),
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
        restaurantId: rest._id,
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

router.get("/hygienereport/:id", async (req, res) => {
  try {
    const feedback = await FeedBack.find({ restaurantId: req.params.id });

    const featureMap = {};

    feedback.forEach((feedbackItem) => {
      Object.keys(feedbackItem._doc).forEach((key) => {
        if (
          key !== "_id" &&
          key !== "userId" &&
          key !== "restaurantId" &&
          key !== "currentDate" &&
          key !== "createdAt" &&
          key !== "updatedAt" &&
          key !== "__v" &&
          key !== "orderId"
        ) {
          const featureValue = feedbackItem._doc[key];
          if (featureMap.hasOwnProperty(key)) {
            if (featureMap[key].hasOwnProperty(featureValue)) {
              featureMap[key][featureValue]++;
            } else {
              featureMap[key][featureValue] = 1;
            }
          } else {
            featureMap[key] = {};
            featureMap[key][featureValue] = 1;
          }
        }
      });
    });

    Object.keys(featureMap).forEach((key) => {
      const totalFeedback = feedback.length;
      Object.keys(featureMap[key]).forEach((featureValue) => {
        const featureValueCount = featureMap[key][featureValue];
        featureMap[key][featureValue] = Math.round(
          (featureValueCount / totalFeedback) * 100
        );
      });
    });

    res.json(featureMap);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
 
});
router.get("/accuracy", async (req, res) => {
  try {
    const feedbackData = await FeedBack.find();
    const checklistData = await Checklist.find();

    const trainingData = feedbackData.map((feedback) => {
      const checklist = checklistData
        .filter((item) => item.restaurantId === feedback.restaurantId)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      const latestChecklist = checklist[0];

      return [
        tf.cast(latestChecklist?.foodPackagingSanitized === "yes", "bool"),
        tf.cast(latestChecklist?.utensilsSanitized === "yes", "bool"),
        tf.cast(
          feedback.foodPackaging === "good" ||
            feedback.foodPackaging === "excellent",
          "bool"
        ),
        tf.cast(
          feedback.foodQuality === "good" ||
            feedback.foodQuality === "excellent",
          "bool"
        ),
        tf.cast(
          feedback.foodTaste === "good" || feedback.foodTaste === "excellent",
          "bool"
        ),
        tf.cast(
          latestChecklist?.cleanlinessRating === 4 ||
            latestChecklist?.cleanlinessRating === 5,
          "bool"
        ),
      ];
    });

    const targetData = feedbackData.map((feedback) => {
      return [
        tf.cast(
          feedback.overallExperience === "excellent" ||
            feedback.overallExperience === "good",
          "bool"
        ),
      ];
    });

    const xs = tf.tensor2d(trainingData, [
      trainingData.length,
      trainingData[0].length,
    ]);
    const ys = tf.tensor2d(targetData, [
      targetData.length,
      targetData[0].length,
    ]);

    const predictions = model.predict(xs).cast("bool").round();

    const ysBool = ys.cast("bool").greater(0.5);
    const fpTensor = tf.logicalAnd(predictions.logicalNot(), ysBool);
    const fnTensor = tf.logicalAnd(predictions, ysBool.logicalNot());

    const tp = predictions.logicalAnd(ysBool).sum().dataSync()[0];
    const fp = fpTensor.sum().dataSync()[0];
    const fn = fnTensor.sum().dataSync()[0];

    const precision = tp / (tp + fp);
    const recall = tp / (tp + fn);
    const f1Score = (2 * (precision * recall)) / (precision + recall);
    const Nn = feedbackData.length - tp - fn;
    const tn = Nn - fp;

    const accuracy = (tp + tn) / (tp + tn + fp + fn);
    const confusionMatrix = {
      truePositives: tp,
      falsePositives: fp,
      trueNegatives: tn,
      falseNegatives: fn,
    };

    res
      .status(200)
      .json({ accuracy: accuracy, confusionMatrix: confusionMatrix });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error calculating accuracy" });
  }

});

module.exports = router;
