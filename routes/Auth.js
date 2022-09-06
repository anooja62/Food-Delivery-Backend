const router = require("express").Router();
const user = require("../model/usermodel");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer')

router.post("/register", async (req, res) => {
  try {
    //generate new password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    //create new user
    const newUser = new user({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
      otp:req.body._otp,
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

    const blockedUser = await user.findOne({
      isBlocked: 1,
      email: req.body.email,
    });
    blockedUser && res.status(404).json("Access denied");

    if (users && !blockedUser) {
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

router.put("/update/:id", async (req, res) => {
  try {
    //generate new password
    let hashedPassword;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(req.body.password, salt);
    }

    const registerations = await user.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword,
    });

    //save user return response

    res.status(201).json("updated");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

router.get("/all-user", async (req, res) => {
  try {
    const allUser = await user.find({
      isBlocked: 0,
    });

    res.status(200).json(allUser);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});
router.put("/block/:id", async (req, res) => {
  try {
    const users = await user.findByIdAndUpdate(req.params.id, {
      isBlocked: 1,
    });
    const allUser = await user.find({
      isBlocked: 0,
    });
    res.status(200).json(allUser);
  } catch (err) {
    return res.status(500).json(err);
  }
});

//send otp

router.put("/send-otp", async (req, res) => {
  const _otp = Math.floor(100000 + Math.random() * 900000);

  const users = await user.findOne({ email: req.body.email });

   // send to user mail
   if (!users) {
     res.send({ status: 500, message: "user not found" });
   }

  let testAccount = await nodemailer.createTestAccount()

  let transporter = nodemailer.createTransport({
    service: "gmail",
    
    auth: {
      user: "deliorderfoods@gmail.com",
      pass: "yaqcvvzakzukldgz",
    },
  });
  let info = await transporter.sendMail({
    from: "deliorderfoods@gmail.com",
    to: req.body.email, // list of receivers
    subject: "Reset your password", // Subject line
    text: String(_otp),
  });

  if (info.messageId) {
   
    user.updateOne({ email: req.body.email},{otp: _otp})
      .then(result => {
        res.send({ status: 200, message: "otp send" });
      })
      .catch((err) => {
        res.send({ status: 500, message: "Server err" });
      });
  } else {
    res.send({ status: 500, message: "Server err" });
  }
});

//submit otp
router.put("/submit-otp", async (req, res) => {
  user.findOne({ otp: req.body.otp })
   
      //  update the password

      const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    // update pwd restaurant
    const users = await user.findOne({ email: req.body.email })
    const id = user._id

    const psw = await user.findByIdAndUpdate(id, {
      password:hashedPassword,
      
      
    });
  
    res.status(201).json(psw);
});

module.exports = router;
