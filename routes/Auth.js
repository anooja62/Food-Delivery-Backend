const router = require("express").Router();
const user = require("../model/usermodel");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  try {
    //generate new password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new user({
      name: req.body.name,
      phone:req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      
    });

    //save user return response

    const users = await newUser.save();
    res.status(201).json(users);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
//Login
router.post("/login", async (req, res) => {
  try {
    const users = await user.findOne({ email: req.body.email });
    !users && res.status(404).json("User not found");
    if (users) {
      const validPassword = await bcrypt.compare(
        req.body.password,
        users.password
      );
      !validPassword && res.status(400).json("wrong password");
      if (validPassword) {
        const { password, ...others } = users._doc;
        res.status(200).json(others);
      }
    }
  } catch (err) {
    res.status(500).send({ message: err });
  }
});



//UPDATE PROFILE

router.put('/profile/update',(async (req, res) => {
    const user = await user.findById(req.user.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      //This will encrypt automatically in our model
      if (req.body.password) {
        user.password = req.body.password || user.password;
      }
      const updateUser = await user.save();
      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        password: updateUser.password,
        email: updateUser.email,
       
      });
    } else {
      res.status(401);
      throw new Error('User Not found');
    }
  })
);



module.exports = router;