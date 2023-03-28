/** @format */

const router = require("express").Router();
const checklist = require("../model/checklistmodel");
const restaurant = require("../model/restaurantmodel")
const nodemailer = require("nodemailer");
const cron = require('node-cron');
router.post('/forms', async (req, res) => {
  try {
    const newForm = new checklist({
      ...req.body,
      restaurantId: req.body.restaurantId 
    });

    const savedForm = await newForm.save();
    res.send(savedForm);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error saving form data');
  }

});

const getAllRestaurants = async () => {
  const restaurants = await restaurant.find({});
  return restaurants;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'deliorderfoods@gmail.com',
    pass: 'yaqcvvzakzukldgz',
  },
});
cron.schedule('0 0 * * 1', async () => {
  const restaurants = await getAllRestaurants();
 
  for (const restaurant of restaurants) {
    const mailOptions = {
      from: 'deliorderfoods@gmail.com',
      to: restaurant.email,
      subject: 'Hygiene Checklist Form',
      text: 'Please fill out the hygiene checklist form ',
    };
    await transporter.sendMail(mailOptions);
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  }

});
module.exports = router;
