const express = require("express");
const mongoose = require("mongoose");
const Cors = require("cors")
const authRoutes = require("./routes/Auth");

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


app.listen(port, ()=> {
    console.log(`listening in : ${port}`)
})