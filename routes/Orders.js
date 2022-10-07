const Cart = require("../model/cartmodel");
const Orders = require("../model/ordersmodel")
const menu = require("../model/menumodel");
const router = require("express").Router();

router.post("/add-order/:id", async (req, res) => {
    
  

  const findCart = await Cart.findOne({ userId: req.params.id });

// console.log(findCart)


 
    
    try {
        const { _id, ...others } = findCart._doc;
        const newOrders = new Orders(others);
      const savedOrder = await newOrders.save();
    
  
      res.status(200).json("added");
    } catch (err) {
      res.status(500).json(err);
    }
  
});





router.get(`/get-order/:id`, async (req, res) => {
  let products = [];
  try {
  const order = await Orders.find({ userId: req.params.id });
  for (let i = 0; i < order.length; i++) {

  let tempProducts = []
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
    products.push(tempProducts)
  }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});


router.get(`/get-resturant-order/:id`, async (req, res) => {
  let products = [];
  try {
    const productsOfResturant = await menu.find({ restaurantId: req.params.id ,isDeleted:0 });
    // const length = carts[0].products.length;

   console.log(productsOfResturant)
    for (let i = 0; i < productsOfResturant.length; i++) {
      
      let menus = await Orders.find({ _id: carts[0].products[i].ProductId });
      menus.map((item) => {
        return products.push({
          
          _id: item._id,
          foodname: item.foodname,
          price: item.price,
          image: item.imgUrl,
          category: item.category,
          isDeleted: item.isDeleted,
          restaurantId: item.restaurantId,
          quantity: carts[0].products[i].quantity,
        });
      });
    }
  
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
