const router = require("express").Router()
const user = require("../model/usermodel")

router.post("/register",async(req,res)=>{
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password,salt)
try {
    const newUser = new user({
        name:req.body.name,
        
        email:req.body.email,
        password:hashedPassword,
        phone:req.body.phone
    })
    const users = await newUser.save()
    res.status(201).json(user)
}catch(err){
    res.status(500).json()
}

})

//Login
router.post("/login", async (req, res) => {
    try {
      const user = await user.findOne({ email: req.body.email });
      !user && res.status(404).json("user not found");
      if(user)
      {
          const validPassword = await bcrypt.compare(req.body.password, user.password)
          !validPassword && res.status(400).json("wrong password")
          if(validPassword){
            const { password, ...others } = user._doc;
              res.status(200).json(others)
          }
      }  
         
    } catch (err) {
      res.status(500).send({message:err})
    }

})
module.exports = router