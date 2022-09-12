const Cart = require("../model/cartmodel");
const menu = require("../model/menumodel");
const router = require("express").Router();

router.post("/add-cart", async (req, res) => {
  
  let products = [];
  const findCart = await Cart.findOne({ userId: req.body.userId });

  if (findCart !== null) {
    const updateUser = await findCart.updateOne({ $set: req.body });
    const carts = await Cart.find({ userId: req.body.userId });
    const length = carts[0].products.length;
   
    for (let i = 0; i < length; i++) {
     
      let menus = await menu.find({ _id: carts[0].products[i].ProductId });
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
  } else {
    const newCart = new Cart(req.body);
    try {
      const savedCart = await newCart.save();
      const carts = await Cart.find({ userId: req.body.userId });
      const length = carts[0].products.length;
      
      for (let i = 0; i < length; i++) {
       
        let menus = await menu.find({ _id: carts[0].products[i].ProductId });
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
  }
});

//UPDATE PRODUCTS
router.put("/:id", async (req, res) => {
  try {
    const updatedCart = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE PRODUCTS
router.delete("/:id", async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has  been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});
//GET USER CART
router.get("/find/:id", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.id });

    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/allCart", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (err) {
    req.status(500).json(err);
  }
});

router.get("/get-cart/:id", async (req, res) => {
  let products = [];
  try {
    const carts = await Cart.find({ userId: req.params.id });
    const length = carts[0].products.length;
   
    for (let i = 0; i < length; i++) {
      
      let menus = await menu.find({ _id: carts[0].products[i].ProductId });
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
