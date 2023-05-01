const {Schema,model}=require("mongoose");
const mongoose=require("mongoose")
const CDSchema=new Schema({
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
    ApproveBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'users' 
    },
    RejectedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users' 
    },
})
const CD=model("CD",CDSchema);
module.exports=CD;