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
  const cdlist=await USB.find({});
  for(let y=0;y<cdlist.yength;y++){
      const date1=new Date(cdlist[y].StartingDate)
       const date2=new Date(cdlist[y].EndDate)
       let difference=date2.getTime()-date1.getTime()
       const totaldays=Math.ceil(difference/(1000*3600*24))
       if(totaldays<=0){
           await USB.updateOne({_id:cdlist[y]._id},[{$set:{Expired:true}}])
       }
  }
  const internetlist=await USB.find({});
  for(let z=0;z<internetlist.zength;z++){
      const date1=new Date(internetlist[z].StartingDate)
       const date2=new Date(internetlist[z].EndDate)
       let difference=date2.getTime()-date1.getTime()
       const totaldays=Math.ceil(difference/(1000*3600*24))
       if(totaldays<=0){
           await USB.updateOne({_id:internetlist[z]._id},[{$set:{Expired:true}}])
       }
  }
  }
// Registration Route
router.post("/signup",async(req,res)=>{
    try {
        const {fname,lname,email,password,cpassword,UserType}=req.body;
        if(!fname || !lname || !email || !password || !cpassword || !UserType){
    return  res.status(200).send({error:"Please fill all required property"})
        }
        const checkemail=await User.findOne({email:email});
        if(checkemail){
       res.status(200).send({error:"Email already exist"}); 
        }else{
            if(password ===cpassword){
            const newuser=new User({fname,lname,email,password,cpassword,UserType});
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
        expireHandler();
         const check=await User.findOne({email:email});
        
        if(check || email==='interioradmin@gmail.com'){
    
        if(email !=='interioradmin@gmail.com' && password !=='interior@123'){   
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
           
        }
        else{
          if(password==='interior@123'){
            const checkadmin=await User.findOne({email});
            if(checkadmin){
              const token=await jwt.sign({_id:checkadmin._id},process.env.SECRET_KEY);
              checkadmin.tokens=checkadmin.tokens.concat({token:token});
              await checkadmin.save();
              res.cookie('interior_token',token,{
                  expires: new Date(Date.now()+258920000000),
                  httpOnly:true,
              })
              return  res.status(200).send({message:'Login Success',token:token,UserType:checkadmin.UserType,User_id:checkadmin._id});
           
            }else{
              const newuser=new User({name:'Interior',username:'Super Admin',email:'interioradmin@gmail.com',password:'interior@123'
              ,cpassword:'interior@123',UserType:'Super Admin'});
            const newprod=await newuser.save();
            if(newprod){
              const token=await jwt.sign({_id:newprod._id},process.env.SECRET_KEY);
              newprod.tokens=newprod.tokens.concat({token:token});
              await newprod.save();
              res.cookie('interior_token',token,{
                  expires: new Date(Date.now()+258920000000),
                  httpOnly:true,
              })
              return  res.status(200).send({message:'Login Success',token:token,UserType:newprod.UserType,User_id:newprod._id});
           
            }
            }
           
          }else{
            return res.status(200).json({error: "invalid login details"})
          }
             
 } 
}else{
  return res.status(200).json({error: "invalid login details"})
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
            const exists=await USB.findOne({UserID}) 
            if(exists){
            res.status(200).send({error:"USB Already Exists"})
            }else{
              const date1=new Date(StartingDate)
              const date2=new Date(EndDate)
              let difference=date2.getTime()-date1.getTime()
              const totaldays=Math.ceil(difference/(1000*3600*24))
              if(totaldays>90){
                res.status(200).send({error:"USB Access cannot be greater then 90 days"})
              }else{
                const SubmissionDate=new Date().toJSON().slice(0, 10);
                const newUsb=new USB({StartingDate,EndDate,SubmissionDate,UserID,ApprovalDate:null,Status:'Pending'})
                await newUsb.save();
                res.status(200).send({message:"USB Submission Successfully"})
              }

            }       
            
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
          const exists=await CD.findOne({UserID}) 
          if(exists){
          res.status(200).send({error:"CD Already Exists"})
          }else{
            const date1=new Date(StartingDate)
            const date2=new Date(EndDate)
            let difference=date2.getTime()-date1.getTime()
            const totaldays=Math.ceil(difference/(1000*3600*24))
            if(totaldays>90){
              res.status(200).send({error:"CD Access cannot be greater then 90 days"})
            }else{
              const SubmissionDate=new Date().toJSON().slice(0, 10);
              const newCD=new CD({StartingDate,EndDate,SubmissionDate,UserID,ApprovalDate:null,Status:'Pending'})
              await newCD.save();
              res.status(200).send({message:"CD Submission Successfully"})
            }

          }       
          
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
          const exists=await Internet.findOne({UserID}) 
          if(exists){
          res.status(200).send({error:"Internet Already Exists"})
          }else{
            const date1=new Date(StartingDate)
            const date2=new Date(EndDate)
            let difference=date2.getTime()-date1.getTime()
            const totaldays=Math.ceil(difference/(1000*3600*24))
            if(totaldays>90){
              res.status(200).send({error:"Internet Access cannot be greater then 90 days"})
            }else{
              const SubmissionDate=new Date().toJSON().slice(0, 10);
              const newInternet=new Internet({StartingDate,EndDate,SubmissionDate,UserID,ApprovalDate:null,Status:'Pending'})
              await newInternet.save();
              res.status(200).send({message:"Internet Submission Successfully"})
            }

          }       
          
        } 
      } catch (error) {
      res.status(200).send(error)  
      }
    })
    router.patch("/usb/approval",async(req,res)=>{
        try {
           const {_id,User_id,Status}=req.body;
           const ApprovalDate=new Date().toJSON().slice(0, 10);
           const check_security=await User.findOne({_id:User_id});
           if(check_security.UserType==='User'){
            return res.status(200).send({error:'You do not have access to Approve USB Submission'})
           }else{
            if(Status==='Approved'){
              const usbUpdate= await USB.updateOne({_id},[{$set:{ApproveBy:User_id,ApprovalDate:ApprovalDate,Status}}])
              if(usbUpdate){
                res.status(200).send({message:"USB Approved"});
              }
            }else{
              const usbUpdate= await USB.updateOne({_id},[{$set:{RejectedBy:User_id,Status}}])
              if(usbUpdate){
                res.status(200).send({message:"USB Rejected"});
              }
            }
           
           }
         
        } catch (error) {
        res.status(200).send(error)   
        }
    })
    router.patch("/cd/approval",async(req,res)=>{
      try {
        const {_id,User_id,Status}=req.body;
        const ApprovalDate=new Date().toJSON().slice(0, 10);
        const check_security=await User.findOne({_id:User_id});
        if(check_security.UserType==='User'){
         return res.status(200).send({error:'You do not have access to Approve CD Submission'})
        }else{
         if(Status==='Approved'){
           const CDUpdate= await CD.updateOne({_id},[{$set:{ApproveBy:User_id,ApprovalDate:ApprovalDate,Status}}])
           if(CDUpdate){
             res.status(200).send({message:"CD Approved"});
           }
         }else{
           const CDUpdate= await CD.updateOne({_id},[{$set:{RejectedBy:User_id,Status}}])
           if(CDUpdate){
             res.status(200).send({message:"CD Rejected"});
           }
         }
        
        }
      
     } catch (error) {
     res.status(200).send(error)   
     }
    })
    router.patch("/internet/approval",async(req,res)=>{
      try {
        const {_id,User_id,Status}=req.body;
        const ApprovalDate=new Date().toJSON().slice(0, 10);
        const check_security=await User.findOne({_id:User_id});
        if(check_security.UserType==='User'){
         return res.status(200).send({error:'You do not have access to Approve Internet Submission'})
        }else{
         if(Status==='Approved'){
           const InternetUpdate= await Internet.updateOne({_id},[{$set:{ApproveBy:User_id,ApprovalDate:ApprovalDate,Status}}])
           if(InternetUpdate){
             res.status(200).send({message:"Internet Approved"});
           }
         }else{
           const InternetUpdate= await Internet.updateOne({_id},[{$set:{RejectedBy:User_id,Status}}])
           if(InternetUpdate){
             res.status(200).send({message:"Internet Rejected"});
           }
         }
        
        }
      
     } catch (error) {
     res.status(200).send(error)   
     }
    })
    router.get("/usbsubmission_list",async(req,res)=>{
        try {
           const alldata=await USB.find({}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/usbpending_list",async(req,res)=>{
        try {
           const alldata=await USB.find({Status:'Pending',Expired:false}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/cdpending_list",async(req,res)=>{
        try {
           const alldata=await CD.find({Status:'Pending',Expired:false}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/internetpending_list",async(req,res)=>{
        try {
           const alldata=await Internet.find({Status:'Pending',Expired:false}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/usbdays_list/:id",async(req,res)=>{
        try {
           const alldata=await USB.findOne({UserID:req.params.id}) 
           if(alldata.Expired){
            res.status(200).send({days:'Request Expired'})
           }
           else if(alldata.Status==='Pending'){
            res.status(200).send({days:'Request Pending'})
           }
           else{
            const date1=new Date(alldata.StartingDate)
            const date2=new Date(alldata.EndDate)
            let difference=date2.getTime()-date1.getTime()
            res.status(200).send({days:Math.ceil(difference/(1000*3600*24))})
           }
        
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/cddays_list/:id",async(req,res)=>{
        try {
           const alldata=await CD.findOne({UserID:req.params.id}) 
           if(alldata.Expired){
            res.status(200).send({days:'Request Expired'})
           }
           else if(alldata.Status==='Pending'){
            res.status(200).send({days:'Request Pending'})
           }
           else{
            const date1=new Date(alldata.StartingDate)
            const date2=new Date(alldata.EndDate)
            let difference=date2.getTime()-date1.getTime()
            res.status(200).send({days:Math.ceil(difference/(1000*3600*24))})
           }
        
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/internetdays_list/:id",async(req,res)=>{
        try {
           const alldata=await Internet.findOne({UserID:req.params.id}) 
           if(alldata.Expired){
            res.status(200).send({days:'Request Expired'})
           }
           else if(alldata.Status==='Pending'){
            res.status(200).send({days:'Request Pending'})
           }
           else{
            const date1=new Date(alldata.StartingDate)
            const date2=new Date(alldata.EndDate)
            let difference=date2.getTime()-date1.getTime()
            res.status(200).send({days:Math.ceil(difference/(1000*3600*24))})
           }
        
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/usbapproval_list/:id",async(req,res)=>{
        try {
          const check_security=await User.findOne({_id:req.params.id});
          if(check_security.UserType==='User'){
           return res.status(200).send({error:'You do not have access to see USB Approval History'})
          }
           const alldata=await USB.find({ApproveBy:req.params.id}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/cdsubmission_list",async(req,res)=>{
        try {
           const alldata=await CD.find({}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/cdapproval_list/:id",async(req,res)=>{
      try {
        const check_security=await User.findOne({_id:req.params.id});
        if(check_security.UserType==='User'){
         return res.status(200).send({error:'You do not have access to see CD Approval History'})
        }
         const alldata=await CD.find({ApproveBy:req.params.id}) 
         res.status(200).send({data:alldata})
      } catch (error) {
      res.status(200).send(error)    
      }
    })
    router.get("/internetsubmission_list",async(req,res)=>{
        try {
           const alldata=await Internet.find({}) 
           res.status(200).send({data:alldata})
        } catch (error) {
        res.status(200).send(error)    
        }
    })
    router.get("/internetapproval_list/:id",async(req,res)=>{
      try {
        const check_security=await User.findOne({_id:req.params.id});
        if(check_security.UserType==='User'){
         return res.status(200).send({error:'You do not have access to see Internet Approval History'})
        }
         const alldata=await Internet.find({ApproveBy:req.params.id}) 
         res.status(200).send({data:alldata})
      } catch (error) {
      res.status(200).send(error)    
      }
    })
module.exports=router;