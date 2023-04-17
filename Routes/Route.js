const express=require("express");
const router=express.Router();
const jwt = require('jsonwebtoken');
const bcrypt=require("bcryptjs")
const dotenv=require("dotenv");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const User=require("../Models/User")



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
          return  res.status(201).send({message:'User Created',token:token,UserType:UserType});
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
            return  res.status(200).send({message:'Login Success',token:token,UserType:check.UserType});
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
module.exports=router;