const {Schema,model}=require("mongoose");
const mongoose=require("mongoose")
const UsbSchema=new Schema({
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
const USB=model("USB",UsbSchema);
module.exports=USB;