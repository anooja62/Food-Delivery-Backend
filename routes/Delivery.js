const router = require("express").Router();
const deliveryboy = require("../model/deliverymodel");
const bcrypt = require("bcrypt");

router.post("/delivery", async (req, res) => {
  try {
    //generate new password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new deliveryboy
    const newDeliveryboy = new deliveryboy({
      name: req.body.name,
      phone:req.body.phone,
      email: req.body.email,
      city:req.body.city,
      password: hashedPassword,
      
    });

    //save user return response

    const deliveryboys = await newDeliveryboy.save();
    res.status(201).json(deliveryboys);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


router.get("/all-deliveryboy",  async (req,res)=>{
  try {
  const allDeliveryboy = await deliveryboy.find({
    isApproved:0
  })
 
  res.status(200).json(allDeliveryboy);
  } catch(err) {
      res.status(500).json(err);
      console.log(err);
  }
})

router.put("/approve/:id", async (req,res) => {

        try{
            const deliveryboys = await deliveryboy.findByIdAndUpdate(req.params.id,{
              isApproved:1
            })
            const allDeliveryboy = await deliveryboy.find({
              isApproved: 0,
            });
            res.status(200).json(allDeliveryboy);
        }catch(err){
            return res.status(500).json(err);
        }

})

router.put("/reject/:id", async (req,res) => {

try{
    const deliveryboys = await deliveryboy.findByIdAndUpdate(req.params.id,{
      isApproved:0
    })
    res.status(200).json("updated",)
}catch(err){
    return res.status(500).json(err);
}

})




module.exports = router;