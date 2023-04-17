const {Schema,model}=require("mongoose");
const bcrypt=require("bcryptjs")
const validatornpm=require("validator");
const productSchema=new Schema({
    name:{
        type: String,
        required: true,
    },
    username:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: [true, "Email adress is already present"],
        validate:{
            validator:function(val){
                return validatornpm.isEmail(val)
            },
            message:"Please enter valid email"
        }
    },
    password:{
        type: String,
        min: [7,"password should countains atleast 7 characters"],
        required: true,
        trim: true
    },
    cpassword:{
     type: String,
     min: [7,"password should countains atleast 7 characters"],
     trim: true
 },
 UserType:{
    type:String,
    required:true,
 },
 tokens:[
    {
        token:{
            type:String,
            trim: true
        }
    }
]
})
productSchema.pre("save",async function(next){
    if(this.isModified("password")){
       this.password=await bcrypt.hash(this.password,12);
       this.cpassword=await bcrypt.hash(this.cpassword,12);
       }
       next();
})
const User=model("User",productSchema);

module.exports=User;