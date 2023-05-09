const {Schema,model}=require("mongoose");
const mongoose=require("mongoose")
const UsbSchema=new Schema({
    StartingDate:{
        type: String,
        required:true,
    },
    EndDate:{
        type:String,
        required:true,
    },
    SubmissionDate:{
        type:String,  
    },
    ApprovalDate:{
        type:String,
    },
    Expired:{
        type:Boolean,
        default:false
    },
    Status:{
    type:String,
    required:true,
    },
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    },
    photo:{
        type: String,
         },
    ApproveBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'users' 
    },
    RejectedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users' 
    },
})
const USB=model("USB",UsbSchema);
module.exports=USB;