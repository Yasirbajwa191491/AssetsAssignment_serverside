const {Schema,model}=require("mongoose");
const mongoose=require("mongoose")
const InternetSchema=new Schema({
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
    Status:{
        type:String,
        required:true,
        },
    Expired:{
        type:Boolean,
        default:false
    },
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
    }
})
const Internet=model("Internet",InternetSchema);
module.exports=Internet;