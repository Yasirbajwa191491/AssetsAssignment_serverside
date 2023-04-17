const express=require("express");
const router=express.Router();
const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs")
const dotenv=require("dotenv");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const User=require("../Models/User")
const USB = require("../Models/Usb");
const CD = require("../Models/CD");
const Internet = require("../Models/Internet");


dotenv.config({path:'./config.env'});
router.use(cors({credentials: true, origin: 'http://localhost:3000'}));
router.use(cookieParser());

router.get("/",(req,res)=>{
    res.send("home")
})
// Registration Route
router.post("/signup",async(req,res)=>{
    try {
        const {name,username,email,password,cpassword,UserType}=req.body;
        if(!name || !username || !email || !password || !cpassword || !UserType){
    return  res.status(200).send({error:"Please fill all required property"})
        }
        const checkemail=await User.findOne({email:email});
        if(checkemail){
       res.status(200).send({error:"Email already exist"}); 
        }else{
            if(password ===cpassword){
            const newuser=new User({name,username,email,password,cpassword,UserType});
            const newprod=await newuser.save();
            if(newprod){
                const token=await jwt.sign({_id:newprod._id},process.env.SECRET_KEY);
                newprod.tokens=newprod.tokens.concat({token:token});
                await newprod.save();
                res.cookie('interior_token',token,{
                    expires: new Date(Date.now()+258920000000),
                    httpOnly:true,
                })
          return  res.status(201).send({message:'User Created',token:token,UserType:UserType,User_id:newprod._id});
            }else{
             return   res.status(201).send({error:'User not Created'});

            }
            }else{
    return   res.status(200).send({error:"Password and Confirm Password are not matching"}); 

            }
        }
    } catch (error) {
       res.status(200).send(error) 
    }
})


//Login Route
router.post("/login",async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email || !password){
            res.status(200).send({error:"Please fill all required fields"})
        }
         const check=await User.findOne({$or:[{'email':email},{'username':email}]});
        
        if(check){
        const passwordCheck=await bcrypt.compare(password,check.password)
    
        if(passwordCheck){
            const token=await jwt.sign({_id:check._id},process.env.SECRET_KEY);
            check.tokens=check.tokens.concat({token:token});
            await check.save();
            res.cookie('interior_token',token,{
                expires: new Date(Date.now()+258920000000),
                httpOnly:true,
            })
            return  res.status(200).send({message:'Login Success',token:token,UserType:check.UserType,User_id:check._id});
        }else{
            return res.status(200).json({error: "invalid login details"})
        }
        }else{
            return res.status(200).json({error: "invalid login detail1"})
        }
    } catch (error) {
        res.status(200).send(error) 
        
    }
    })
    router.post("/Usb_Submission",async(req,res)=>{
        try {
          const {StartingDate,EndDate,UserID}=req.body;
          if(!StartingDate || !EndDate || !UserID){
            res.status(200).send({error:"Please fill all required fields"})
          } else{
            const SubmissionDate=new Date().toJSON().slice(0, 10);
            const newUsb=new USB({StartingDate,EndDate,SubmissionDate,UserID,ApprovalDate:null})
            await newUsb.save();
            res.status(200).send({message:"USB Submission Successfully"})
          } 
        } catch (error) {
        res.status(200).send(error)  
        }
    })
    router.post("/CD_Submission",async(req,res)=>{
        try {
          const {StartingDate,EndDate,UserID}=req.body;
          if(!StartingDate || !EndDate || !UserID){
            res.status(200).send({error:"Please fill all required fields"})
          } else{
            const SubmissionDate=new Date().toJSON().slice(0, 10);
            const newCD=new CD({StartingDate,EndDate,SubmissionDate,UserID,ApprovalDate:null})
            await newCD.save();
            res.status(200).send({message:"USB Submission Successfully"})
          } 
        } catch (error) {
        res.status(200).send(error)  
        }
    })
    router.post("/Internet_Submission",async(req,res)=>{
        try {
          const {StartingDate,EndDate,UserID}=req.body;
          if(!StartingDate || !EndDate || !UserID){
            res.status(200).send({error:"Please fill all required fields"})
          } else{
            const SubmissionDate=new Date().toJSON().slice(0, 10);
            const newInternet=new Internet({StartingDate,EndDate,SubmissionDate,UserID,ApprovalDate:null})
            await newInternet.save();
            res.status(200).send({message:"USB Submission Successfully"})
          } 
        } catch (error) {
        res.status(200).send(error)  
        }
    })
    router.get("/usbsubmission_list/:id",async(req,res)=>{
        try {
           const alldata=await USB.find({UserID:req.params.id}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/cdsubmission_list/:id",async(req,res)=>{
        try {
           const alldata=await CD.find({UserID:req.params.id}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/internetsubmission_list/:id",async(req,res)=>{
        try {
           const alldata=await Internet.find({UserID:req.params.id}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
module.exports=router;