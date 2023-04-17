const {Schema,model}=require("mongoose");
const mongoose=require("mongoose")
const CDSchema=new Schema({
    StartingDate:{
        type: Date,
        required:true,
    },
    EndDate:{
        type:Date,
        required:true,
    },
    SubmissionDate:{
        type:Date,  
    },
    ApprovalDate:{
        type:Date,
    },
    ApproveBy:{
        type: mongoose.Schema.Types.ObjectId  
    },
    Expired:{
        type:Boolean,
        default:false
    },
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
    }
})
const CD=model("CD",CDSchema);
module.exports=CD;