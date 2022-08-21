const router = require("express").Router();
const shipping = require("../model/addressmodel");

router.post("/address", async (req, res) => {
  try {
   
    //create new address
    const newShipping = new shipping({
      name: req.body.name,
      phone:req.body.phone,
      pincode: req.body.pincode,
      address:req.body.address,
      userId:req.body.userId
      
    });

    //save user return response

    const ship = await newShipping.save();
    res.status(201).json(ship);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/all-addresses",  async (req,res)=>{
  try {
  const allShipping = await shipping.find({
    isDeleted:0
  })
 
  res.status(200).json(allShipping);
  } catch(err) {
      res.status(500).json(err);
      console.log(err);
  }
})

router.put("/deleted/:id", async (req,res) => {

        try{
            const ship = await restaurant.findByIdAndUpdate(req.params.id,{
              isDeleted:1
            })
            const allRestaturent = await restaurant.find({
              isDeleted: 0,
            });
            res.status(200).json(allShipping);
        }catch(err){
            return res.status(500).json(err);
        }

})





module.exports = router;