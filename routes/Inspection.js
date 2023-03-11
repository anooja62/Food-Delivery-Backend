/** @format */

const router = require("express").Router();
const Inspection = require("../model/inspectionmodel");
const Restaurant = require("../model/restaurantmodel");
router.post("/schedule-inspection", async (req, res) => {
  const newInspection = new Inspection({
    restaurantId: req.body.restaurantId,
    restaurantName: req.body.restaurantName,
    scheduledDate: req.body.scheduledDate,
    isReportDone: false,
  });
  await Restaurant.findByIdAndUpdate(
    req.body.restaurantId,
    { isScheduledForInspection: true },
    { new: true }
  );
  newInspection
    .save()
    .then(() => res.send("Inspection scheduled!"))
    .catch((err) => console.log(err));
});
router.get("/scheduled-restaurants", async (req, res) => {
  Inspection.find(
    { isReportDone: false },
    { _id: 1, restaurantName: 1, scheduledDate: 1, restaurantId: 1, isDone: 1 }
  )
    .then((inspections) => {
      const restaurantIds = inspections.map(
        (inspection) => inspection.restaurantId
      );
      return Restaurant.find({ _id: { $in: restaurantIds } }).then(
        (restaurants) => {
          const addressMap = restaurants.reduce((map, restaurant) => {
            map[restaurant._id.toString()] = restaurant.address;
            return map;
          }, {});
          const inspectionsWithAddress = inspections
            .filter((inspection) => !inspection.isReportDone) 
            .map((inspection) => {
              return {
                _id: inspection._id,
                restaurantName: inspection.restaurantName,
                scheduledDate: inspection.scheduledDate,
                restaurantId: inspection.restaurantId,
                isDone: inspection.isDone,
                address: addressMap[inspection.restaurantId.toString()],
              };
            });
          res.json(inspectionsWithAddress);
        }
      );
    })
    .catch((err) => console.log(err));
});


router.put(`/update-inspection/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const inspection = await Inspection.findById(id);

    if (!inspection) {
      return res.status(404).send("Inspection not found");
    }
    await Restaurant.findByIdAndUpdate(
      inspection.restaurantId,
      { isScheduledForInspection: false },
      { new: true }
    );
    inspection.isDone = req.body.isDone;
    await inspection.save();

    res.send("Inspection updated successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});
router.put(`/update-inspection-report/:id`, async (req, res) => {
  try {
    const id = req.params.id;
    const inspection = await Inspection.findById(id);

    if (!inspection) {
      return res.status(404).send("Inspection not found");
    }

    inspection.inspectorName = req.body.inspectorName;
    inspection.inspectionResults = req.body.inspectionResults;
    inspection.inspectionRating = req.body.inspectionRating;
    inspection.isReportDone = true;

    await inspection.save();

    res.send("Inspection updated successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

router.get("/restaurants-inspection-report-view/:id", async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const inspections = await Inspection.find({ restaurantId });

    if (!inspections) {
      return res.status(404).send("No inspections found for this restaurant");
    }

    res.json(inspections);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
