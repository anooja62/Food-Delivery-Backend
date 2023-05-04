const express = require("express");
const mongoose = require("mongoose");
const Cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/Auth");
const restaurantRoutes = require("./routes/restaurant");
const deliveryRoutes = require("./routes/Delivery");
const reviewRoutes = require("./routes/Review");
const addressRoutes = require("./routes/Address");
const foodRoutes = require("./routes/Food");
const comboRoutes = require("./routes/Combo");
const messageRoutes = require("./routes/Message");
const cartRoutes = require("./routes/Cart");
const paymentRoutes = require("./routes/Payment");
const orderRoutes = require("./routes/Orders");
const checklistRoutes = require("./routes/Checklist")
const salaryRoutes = require("./routes/Salary");
const feedbackRoutes = require("./routes/FeedBack")
const inspectRoutes = require("./routes/Inspection")
//app config
const app = express();
const port = 9000;
dotenv.config();

app.use(express.json());
app.use(
  Cors({
    origin: [
      "http://localhost:3000",
      "https://deliorder.onrender.com",
      `https://us1.locationiq.com/v1/search.php?key=pk.de89a66c75d2c7e2838b70033a082722&q=${address}&format=json`
     
    ],
    credentials: true,
    
  })
);


const MONGO_URI =
  "mongodb+srv://admin:Uous7v8k5FVxNu9x@cluster0.fyfxtkt.mongodb.net/?retryWrites=true&w=majority";
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected  to mongodb !!"))

  .catch((err) => console.log(err.message));
  app.get("/", async (req, res) => {
   
    res.send("API is running");
  });
app.use("/auth", authRoutes);
app.use("/rest", restaurantRoutes);
app.use("/deli", deliveryRoutes);
app.use("/revi", reviewRoutes);
app.use("/addr", addressRoutes);
app.use("/food", foodRoutes);
app.use("/comb", comboRoutes);
app.use("/msg", messageRoutes);
app.use("/cart", cartRoutes);
app.use("/pay", paymentRoutes);
app.use("/order", orderRoutes);
app.use("/check",checklistRoutes);
app.use("/salary",salaryRoutes);
app.use("/feed",feedbackRoutes);
app.use("/insp",inspectRoutes);
app.listen(port, () => {
  console.log(`listening in : ${port}`);
});
