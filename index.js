const express=require("express");
const app=express();
const dotenv=require("dotenv");
const cors = require('cors')
require("./connection/conn")
app.use(express.json());

app.use(require("./Routes/Route"))
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
 
//environment variable
dotenv.config({path:'./config.env'});
const port=process.env.PORT || 8000;

app.listen(port,()=>{
    console.log('Server is running at the port:'+port);
})
