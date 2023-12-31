const {Schema,model}=require("mongoose");
const mongoose=require("mongoose")
const InternetSchema=new Schema({
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
    ApproveBy:{
        type: mongoose.Schema.Types.ObjectId, 
        ref:'users' 
    },
    RejectedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users' 
    },
    Expired:{
        type:Boolean,
        default:false
    },
    photo:{
        type: String,
         },
    Status:{
    type:String,
    required:true,
    },
    UserID:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'users'
    }
})
const Internet=model("Internet",InternetSchema);
module.exports=Internet;