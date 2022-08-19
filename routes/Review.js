const router = require("express").Router();
const foodreview = require("../model/reviewmodel");


router.post("/review", async (req, res) => {
  try {
   
    //create new food review
    const newFoodreview = new foodreview({
      name: req.body.name,
      description:req.body.description,
      
      
    });

    //save user return response

    const foodreviews = await newFoodreview.save();
    res.status(201).json(foodreviews);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});


router.get("/all-foodreview",  async (req,res)=>{
  try {
  const allFoodreview = await foodreview.find({
    isApproved:0
  })
 
  res.status(200).json(allFoodreview);
  } catch(err) {
      res.status(500).json(err);
      console.log(err);
  }
})

router.put("/approve/:id", async (req,res) => {

        try{
            const foodreviews = await foodreview.findByIdAndUpdate(req.params.id,{
              isApproved:1
            })
            const allFoodreview = await foodreview.find({
              isApproved: 0,
            });
            res.status(200).json(allFoodreview);
        }catch(err){
            return res.status(500).json(err);
        }

})

router.put("/reject/:id", async (req,res) => {

try{
    const foodreviews = await foodreview.findByIdAndUpdate(req.params.id,{
      isApproved:0
    })
    res.status(200).json("updated",)
}catch(err){
    return res.status(500).json(err);
}

})


module.exports = router;