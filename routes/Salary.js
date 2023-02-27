/** @format */

const router = require("express").Router();
const Orders = require("../model/ordersmodel");
const restaurant = require("../model/restaurantmodel");
const salary = require("../model/restaurantsalarymodel");
const menu = require("../model/menumodel");

router.put(`/pay-salary/:id`, async (req, res) => {
  try {
    const orders = await Orders.find({ orderReady: 1 });
    const filteredOrders = [];

    let totalOrderAmount = 0;

    for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      let tempProducts = [];

      for (let j = 0; j < order.products.length; j++) {
        const productId = order.products[j].ProductId;
        const menuItems = await menu.find({ _id: productId });

        for (let k = 0; k < menuItems.length; k++) {
          const menuItem = menuItems[k];

          if (menuItem.restaurantId === req.params.id) {
            tempProducts.push({
              _id: menuItem._id,
              foodname: menuItem.foodname,
              price: menuItem.price,
              image: menuItem.imgUrl,
              category: menuItem.category,
              isDeleted: menuItem.isDeleted,
              restaurantId: menuItem.restaurantId,
              quantity: order.products[j].quantity,
            });
          }
        }
      }

      if (tempProducts.length > 0) {
        const orderAmount = tempProducts.reduce(
          (acc, curr) => acc + curr.price * curr.quantity,
          0
        );

        totalOrderAmount += orderAmount;
        filteredOrders.push({
          _id: order._id,
          products: tempProducts,
          orderAmount,
        });
      }
    }

    const restaurantSalary = totalOrderAmount * 0.5;

    const salaryDoc = new salary({
      restaurantId: req.params.id,
      totalOrderAmount,
      salaryamount: restaurantSalary,
    });

    await salaryDoc.save();

    res.status(200).json({  totalOrderAmount, restaurantSalary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/monthly-salary/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 5); 
    startDate.setDate(1); 

    const salaryData = [];
    let totalSalary = 0;

    for (let i = 0; i < 6; i++) {
      const endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1); 
      endDate.setDate(0); 

      const orders = await Orders.find({
        orderReady: 1,
        updatedAt: { $gte: startDate, $lte: endDate },
      });

      const filteredOrders = [];

      let totalOrderAmount = 0;

      for (let j = 0; j < orders.length; j++) {
        const order = orders[j];
        let tempProducts = [];

        for (let k = 0; k < order.products.length; k++) {
          const productId = order.products[k].ProductId;
          const menuItems = await menu.find({ _id: productId });

          for (let l = 0; l < menuItems.length; l++) {
            const menuItem = menuItems[l];

            if (menuItem.restaurantId === id) {
              tempProducts.push({
                _id: menuItem._id,
                foodname: menuItem.foodname,
                price: menuItem.price,
                image: menuItem.imgUrl,
                category: menuItem.category,
                isDeleted: menuItem.isDeleted,
                restaurantId: menuItem.restaurantId,
                quantity: order.products[k].quantity,
              });
            }
          }
        }

        if (tempProducts.length > 0) {
          const orderAmount = tempProducts.reduce(
            (acc, curr) => acc + curr.price * curr.quantity,
            0
          );

          totalOrderAmount += orderAmount;
          filteredOrders.push({
            _id: order._id,
            products: tempProducts,
            orderAmount,
          });
        }
      }

      const restaurantSalary = totalOrderAmount * 0.5;
      totalSalary += restaurantSalary;

      salaryData.push({
        month: startDate.getMonth() + 1,
        year: startDate.getFullYear(),
        totalOrderAmount,
        salary: restaurantSalary,
      });

      startDate.setMonth(startDate.getMonth() + 1); 
    }

    res.status(200).json({ salaryData, totalSalary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
