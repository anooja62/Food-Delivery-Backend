const Cart = require("../model/cartmodel");
const Orders = require("../model/ordersmodel");
const menu = require("../model/menumodel");
const { request } = require("express");
const router = require("express").Router();
const Payment = require("../model/paymentmodel");
const shipping = require("../model/addressmodel");

router.post("/add-order/:id", async (req, res) => {
  const findCart = await Cart.findOne({ userId: req.params.id });
  
  const MongoCartIdToSting = String(findCart._doc._id);
 
  const getPayment = await Payment.findOne({
    userId: req.params.id,
    cart_id: MongoCartIdToSting,
  });
  

  try {
    const { _id, ...others } = findCart._doc;
    const { address_id, ...otherItems } = getPayment._doc;
    
    const newOrders = new Orders({
      ...others,
      address_id: address_id,
      orderReady: 0,
      status: "captured",
    });
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
            status:   order[i].isDelivered === 1 && 2  ||  order[i].outForDelivery === 1 && 1 || 
          order[i].outForDelivery === 0 && 0 ||  order[i].orderReady === 0 && 0
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

router.put("/order-ready", async (req, res) => {
  try {
    const updateFoodReady = await Orders.findByIdAndUpdate(req.body.id, {
      orderReady: 1,
      outForDelivery: 0,
    });
    let products = [];
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
        
        if (item.restaurantId === req.body.restaurantId) {
          unSkip = true;
        }

        return item.restaurantId === req.body.restaurantId;
      });

      if (unSkip) {
        
        filtered.push(order[i]._id);
        products.push(filtered);
      }

      
    }
   
    res.status(200).json(products);
    
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.get(`/get-delivery-order/:id`, async (req, res) => {
 
  let products = [];

  try {
    const order = await Orders.find({ orderReady: 1, outForDelivery: 0 });
    

    for (let i = 0; i < order.length; i++) {
     

      
      const address = await shipping.findOne({ _id: order[i].address_id });
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
     
      tempProducts.push({ orderId: order[i]._id, address: address });

      
      products.push(tempProducts);
    }

    res.status(200).json(products);
    
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/out-for-delivery", async (req, res) => {
  const updateFoodReady = await Orders.findByIdAndUpdate(req.body.orderId, {
    outForDelivery: 1,
    isDelivered: 0,
  });
  
  let products = [];
  try {
    const order = await Orders.find({ outForDelivery: 0 });
   

    for (let i = 0; i < order.length; i++) {
      
      
      const address = await shipping.findOne({ _id: order[i].address_id });
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
      
      tempProducts.push({ orderId: order[i]._id, address: address });

      
      products.push(tempProducts);
    }

    res.status(200).json(products);
   
  } catch (err) {
    res.status(500).json(err);
  }
});
router.put("/delivered", async (req, res) => {
  const updateFoodReady = await Orders.findByIdAndUpdate(req.body.orderId, {
    isDelivered: 1,
  });
  
  let products = [];
  try {
    const order = await Orders.find({ outForDelivery: 1 });
   

    for (let i = 0; i < order.length; i++) {
      
      const address = await shipping.findOne({ _id: order[i].address_id });
      let tempProducts = [];
      
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
      
      tempProducts.push({ orderId: order[i]._id, address: address, isDelivered: order[i].isDelivered, });

      
      products.push(tempProducts);
    }

    res.status(200).json(products);
    
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get(`/delivered-order`, async (req, res) => {
  
  let products = [];

  try {
    const order = await Orders.find({ outForDelivery: 1 });
   

    for (let i = 0; i < order.length; i++) {
      

      
      const address = await shipping.findOne({ _id: order[i].address_id });
      let tempProducts = [];
      

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
      
      tempProducts.push({
        orderId: order[i]._id,
        address: address,
        isDelivered: order[i].isDelivered,
      });

      
      products.push(tempProducts);
    }

    res.status(200).json(products);
   
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
