const router = require("express").Router();
const deliveryboy = require("../model/deliverymodel");
const bcrypt = require("bcrypt");

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

//update deliveryboy pwd
router.put("/deliveryboy-pw-update", async (req, res) => {

  try {
    console.log(req.body)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // update pwd restaurant
    const deliveryboys = await deliveryboy.findOne({ email: req.body.email })
    const id = deliveryboys._id

    const psw = await deliveryboy.findByIdAndUpdate(id, {
      password:hashedPassword,
      
    });
    res.status(201).json(psw);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
//deliveryboy login
router.post("/delivery-login", async (req, res) => {
  try {
    const deliveryboys = await deliveryboy.findOne({ email: req.body.email });
    !deliveryboys && res.status(404).json("User not found");



    if (deliveryboys) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        deliveryboys.password
      );
      !validPassword && res.status(400).json("wrong password");
      if (validPassword) {
        const { password, ...others } = deliveryboys._doc;
        res.status(200).json(others);
      }
    }
  } catch (err) {
    res.status(500).send({ message: err });
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