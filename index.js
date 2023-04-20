const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cors = require('cors')
const USB=require("./Models/Usb");

require("./connection/conn")
app.use(express.json());

app.use(require("./Routes/Route"))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
 
const expireHandler=async()=>{
const usblist=await USB.find({});
for(let x=0;x<usblist.length;x++){
    const date1=new Date(usblist[x].StartingDate)
     const date2=new Date(usblist[x].EndDate)
     let difference=date2.getTime()-date1.getTime()
     const totaldays=Math.ceil(difference/(1000*3600*24))
     if(totaldays<=0){
         await USB.updateOne({_id:usblist[x]._id},[{$set:{Expired:true}}])
     }
}
}
setInterval(()=>{
expireHandler();
},1000 * 60 * 60 * 24)
dotenv.config({path:'./config.env'});
const port=process.env.PORT || 8000;

app.listen(port,()=>{
    console.log('Server is running at the port:'+port);
})
