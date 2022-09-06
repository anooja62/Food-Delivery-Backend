const express = require("express");
const mongoose = require("mongoose");
const Cors = require("cors")

const authRoutes = require("./routes/Auth");
const restaurantRoutes = require("./routes/restaurant")
const deliveryRoutes = require("./routes/Delivery");
const reviewRoutes = require("./routes/Review");
const addressRoutes = require("./routes/Address");
const foodRoutes = require("./routes/Food");
const comboRoutes = require("./routes/Combo");
const messageRoutes = require("./routes/Message");
const cartRoutes = require("./routes/Cart");





//app config
const app = express();
const port =  9000;


app.use(express.json());
app.use(Cors())

const MONGO_URI = "mongodb+srv://admin:Uous7v8k5FVxNu9x@cluster0.fyfxtkt.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(MONGO_URI, {
   
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(()=> console.log("connected  to mongodb !!"))

.catch(err => console.log(err.message));


app.use("/auth",authRoutes);
app.use("/rest",restaurantRoutes)
app.use("/deli",deliveryRoutes);
app.use("/revi",reviewRoutes)
app.use("/addr",addressRoutes)
app.use("/food",foodRoutes)
app.use("/comb",comboRoutes);
app.use("/msg",messageRoutes)
app.use("/cart",cartRoutes)






app.listen(port, ()=> {
    console.log(`listening in : ${port}`)
})