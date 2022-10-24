const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Cart = require("../model/cartmodel");
const Payment = require("../model/paymentmodel");
const shipping = require("../model/addressmodel");
router.post("/orders", async (req, res) => {
  let orderId;
  try {
    const instance = new Razorpay({
      key_id: "rzp_test_0YsOnkZc3nwtKA",

      key_secret: "oePZv1JdSwiEamTJWy45NG6G",
    });

    const options = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };
    const carts = await Cart.find({ userId: req.body.userId });
    const allShipping = await shipping.find({ userId: req.body.userId });

    const cartId = carts[0]._id;
    const addressId = allShipping[0]._id;
    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
      orderId = order.id;

      const payment = {
        userId: req.body.userId,
        amount: req.body.amount,
        order_id: orderId,
        cart_id: cartId,
        address_id: addressId,
        isPaymentDone:0

      };
      const newPayment = new Payment(payment);
      try {
        const savedPayment = newPayment.save();
        
      } catch (err) {}
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
      .createHmac("sha256", "oePZv1JdSwiEamTJWy45NG6G")
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
     
      try {
        
      } catch (err) {
        res.status(500).json(err);
      }
      const paymentId = await Payment.findOne({ order_id: razorpay_order_id });

      const pay_id = paymentId._id;
      const updatePayment = await Payment.findByIdAndUpdate(pay_id, {
        status: "caputured"
       
      });
      
      return res.status(200).json({
        message: "Payment verified successfully and cart deleted successfully",
      });
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

  

  const crypto = require("crypto");

  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  const { id, amount, order_id, method, status } =
    req.body.payload.payment.entity;
  const paymentId = await Payment.findOne({ order_id: order_id });

  const pay_id = paymentId._id;

  const updatePayment = await Payment.findByIdAndUpdate(pay_id, {
    status: status,
    method: method,
    isPaymentDone:1
  });

  
  if (digest === req.headers["x-razorpay-signature"]) {
    
  } else {
    console.log("error in verifications");
  }
  res.json({ status: "ok" });
});

module.exports = router;
