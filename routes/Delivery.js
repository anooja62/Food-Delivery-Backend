const router = require("express").Router();
const deliveryboy = require("../model/deliverymodel");


router.post("/delivery", async (req, res) => {
  try {
   
    //create new deliveryboy
    const newDeliveryboy = new deliveryboy({
      name: req.body.name,
      phone:req.body.phone,
      email: req.body.email,
      city:req.body.city,
      imgUrl:req.body.imgUrl
     
      
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
    isRejected:0
  })
 
  res.status(200).json(allDeliveryboy);
  } catch(err) {
      res.status(500).json(err);
      console.log(err);
  }
})

router.put("/reject/:id", async (req,res) => {

        try{
            const deliveryboys = await deliveryboy.findByIdAndUpdate(req.params.id,{
              isRejected:1
            })
            const allDeliveryboy = await deliveryboy.find({
              isRejected: 0,
            });
            res.status(200).json(allDeliveryboy);
        }catch(err){
            return res.status(500).json(err);
        }

})





module.exports = router;