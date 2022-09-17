const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");


const Cart = require("../model/cartmodel");
const Payment= require("../model/paymentmodel");
router.post("/orders", async (req, res) => {
  let orderId
  try {
    const instance = new Razorpay({
      key_id: "rzp_test_9L3CizQufAwqct",

      key_secret: "HC7zdhdRoobGyE9hVDPrR486"
    });

    const options =  {
 
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    const carts = await Cart.find({ userId: req.body.userId });
    console.log(carts[0]._id)
    const cartId =carts[0]._id
    instance.orders.create(options, (error, order) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Something Went Wrong!" });
        }
        res.status(200).json({ data: order });
        orderId = order.id
        
        const payment = {
          userId:req.body.userId,
          amount: req.body.amount ,
          order_id:orderId,
          cart_id:cartId,
          
    
        }
        const newPayment = new Payment(payment);
        try {
          const savedPayment = newPayment.save();
          console.log(savedPayment)
        }catch(err){}
    });
} catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
}
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", "HC7zdhdRoobGyE9hVDPrR486")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
});

router.post("/razorpay-callback", async (req, res) => {
   // do a validation
   const secret = "123456789";

   console.log(req.body);
 
   const crypto = require("crypto");
 
   const shasum = crypto.createHmac("sha256", secret);
   shasum.update(JSON.stringify(req.body));
   const digest = shasum.digest("hex");
 
   console.log(digest, req.headers["x-razorpay-signature"]);
   const { id, amount, order_id, method, status } =
   req.body.payload.payment.entity;

   console.log(id, amount, order_id, method, status)

   const updatePayment = await Payment.findOneAndUpdate(order_id,{
    status:status,
    method:method
   
  });
  
  console.log(updatePayment)
   if (digest === req.headers["x-razorpay-signature"]) {
     console.log("request is legit");
     // process it
     console.log("fdsfd", req.body.pay);
  } else {
    console.log("error in verifications");
    // pass it
  }
  res.json({ status: "ok" });
});


module.exports = router;
