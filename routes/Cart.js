const Cart = require("../model/cartmodel")


const router = require("express").Router()


router.post("/add-cart",async (req,res)=>{
    
    console.log(req.body)
    const findCart = await Cart.findOne({userId:req.body.userId})
    // console.log(findCart)
  
        if(findCart !== null){
           const updateUser = await findCart.updateOne({$set:req.body})
           res.status(200).json(updateUser);
        }else{
            const newCart = new Cart(req.body)
            try{
                const savedCart = await newCart.save()
                res.status(200).json(savedCart);
            }catch(err){
                res.status(500).json(err)
            }
        }
   
    
   
   
})



//UPDATA PRODUCTS
router.put("/:id",async (req,res)=>{
  
    try{
        const updatedCart = await User.findByIdAndUpdate(req.params.id,
            {
            $set:req.body
            },
            { new:true } 
        )
        res.status(200).json(updatedCart)
    }catch (err) {
        res.status(500).json(err)
    }
});

//DELETE PRODUCTS
router.delete("/:id",async (req,res)=>{
    try{
        await Cart.findByIdAndDelete(req.params.id)
        res.status(200).json("Cart has  been deleted")
    }catch(err){
        res.status(500).json(err)
    }
});
//GET USER CART
router.get("/find/:id", async (req,res)=>{
    try{
        const cart = await Cart.findOne({userId: req.params.id})
       

        res.status(200).json(cart)
    }catch(err){
        res.status(500).json(err)
    }
});

router.get("/allCart",async (req,res)=>{
    try{
        const carts = await Cart.find()
        res.status(200).json(carts)
    }catch(err){
        req.status(500).json(err)
    }
})



module.exports = router