import express from 'express';
import  mongoose  from 'mongoose';
import cors from 'cors';
import messages from './modal.js'
//app config
const app = express();
const port =  9000;


app.use(express.json());
app.use(cors())

const MONGO_URI = "mongodb+srv://admin:Uous7v8k5FVxNu9x@cluster0.fyfxtkt.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(MONGO_URI, {
   
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(()=> console.log("connected  to mongodb !!"))

.catch(err => console.log(err.message));

app.get('/mes',(req,res)=>
    res.status(200).send("helllo test")
);
app.post("/post",(req,res)=>{
    const dbMessage = req.body
  
    messages.create(dbMessage, (err, data) => {
        
        if (err) {
            res.status(500).send(err)
            console.log(err);
      
          } else {
            res.status(201).send(data)
          }})})
 



app.listen(port, ()=> {
    console.log(`listening in : ${port}`)
})