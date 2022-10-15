const Cart = require("../model/cartmodel");
const Orders = require("../model/ordersmodel");
const menu = require("../model/menumodel");
const { request } = require("express");
const router = require("express").Router();

router.post("/add-order/:id", async (req, res) => {
  const findCart = await Cart.findOne({ userId: req.params.id });

  try {
    const { _id, ...others } = findCart._doc;
    const newOrders = new Orders({ ...others, orderReady: 0 });
    const savedOrder = await newOrders.save();

    res.status(200).json("added");
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get(`/get-order/:id`, async (req, res) => {
  try {
    let products = [];
    const order = await Orders.find({ userId: req.params.id });
    for (let i = 0; i < order.length; i++) {
      let tempProducts = [];
      const length = order[i].products.length;

      for (let j = 0; j < length; j++) {
        let menus = await menu.find({
          _id: order[i].products[j].ProductId,
        });
        menus.map((item) => {
          return tempProducts.push({
            _id: item._id,
            foodname: item.foodname,
            price: item.price,
            image: item.imgUrl,
            category: item.category,
            isDeleted: item.isDeleted,
            restaurantId: item.restaurantId,
            quantity: order[i].products[j].quantity,
          });
        });
      }
      products.push(tempProducts);
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get(`/get-resturant-order/:id`, async (req, res) => {
  let products = [];
  try {
  
    try {
      const order = await Orders.find({ orderReady: 0 });
 
      for (let i = 0; i < order.length; i++) {
      
        let tempProducts = [order[i]._id];
  
        const length = order[i].products.length;
        
        for (let j = 0; j < length; j++) {
          let menus = await menu.find({ _id: order[i].products[j].ProductId });
          menus.map((item) => {
            return tempProducts.push({
              _id: item._id,
              foodname: item.foodname,
              price: item.price,
              image: item.imgUrl,
              category: item.category,
              isDeleted: item.isDeleted,
              restaurantId: item.restaurantId,
              quantity: order[i].products[j].quantity,
            });
          });
        }
        let filtered = [];
        let unSkip = false;
        filtered = tempProducts.filter((item) => {
          if (item.restaurantId === req.params.id) {
            unSkip = true;
          }

          return item.restaurantId === req.params.id;
        });
        if (unSkip) {
          filtered.push(order[i]._id);
          products.push(filtered);
        }

      }

      res.status(200).json(products);
     
    } catch (err) {
      res.status(500).json(err);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/order-ready/:id", async (req, res) => {
  try {
    const updateFoodReady = await Orders.findByIdAndUpdate(req.params.id, {
      orderReady: 1,
    });

    res.status(200).json(updateFoodReady);
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
