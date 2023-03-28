/** @format */

const router = require("express").Router();
const Orders = require("../model/ordersmodel");
const restaurant = require("../model/restaurantmodel");
const salary = require("../model/restaurantsalarymodel");
const menu = require("../model/menumodel");
const deliveryBoy = require("../model/deliverymodel");
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

    const restaurantSalary = totalOrderAmount * 0.6;

    const salaryDoc = new salary({
      restaurantId: req.params.id,
      totalOrderAmount,
      salaryamount: restaurantSalary,
    });

    await salaryDoc.save();
   
    res.status(200).json({ totalOrderAmount, restaurantSalary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/monthly-salary/:id", async (req, res) => {
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

      const restaurantSalary = totalOrderAmount * 0.6;
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
    res.status(500).json({ message: "Internal server error" });
  }
});
router.get("/delivery-salary/:id", async (req, res) => {
  try {
    const deliveryBoyId = req.params.id;
    const currentDate = new Date();

    const salaryData = [];

    for (let i = 0; i < 5; i++) {
      const month = currentDate.getMonth() - i;
      const year = currentDate.getFullYear();
      const startOfMonth = new Date(year, month, 1);
      const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

      const TotalOrderCount = await Orders.countDocuments({
        deliveryBoyId,
        isDelivered: 1,
      });
      const orderCount = await Orders.countDocuments({
        deliveryBoyId,
        isDelivered: 1,
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
      });

      const orders = await Orders.find({
        deliveryBoyId,
        isDelivered: 1,
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
      }).sort({ updatedAt: -1 });

      let orderAmount = 0;

      for (let j = 0; j < orders.length; j++) {
        const order = orders[j];
        const products = order.products;
        let subTotal = 0;
        for (let k = 0; k < products.length; k++) {
          const product = products[k];
          const menus = await menu.findById(product.ProductId);
          subTotal += menus.price * product.quantity;
        }
        orderAmount += subTotal;
      }

      const salary = orderAmount * 0.4;
      const monthName = startOfMonth.toLocaleString("default", { month: "long" });
      const yearOfMonth = startOfMonth.getFullYear();

      salaryData.push({
        deliveryBoyId,
        month: monthName,
        year:yearOfMonth,
        totalOrdersDelivered: orderCount,
        totalOrderAmount: orderAmount,
        salary,
        TotalOrderCount,
      });
    }
   
    res.status(200).json(salaryData);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


module.exports = router;
