import { model, Schema, Types } from "mongoose";
import bcrypt from 'bcryptjs'


const AdminSchema = new Schema({
username : {
    type : String,
    min : [3, "Username is too short!"],
    max : [30, "Username is too long!"],
    required : [true, "Name is required"]
},
img_path : {
    type : String,
    default : "uploads/user-default.png"
},
email : {
    type : String,
    trim : true,
    lowercase : true,
    unique : true,
    required : [true, 'Email address is required!'],
    match :  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
},
password : {
    type : String
},
active_id : {
    type : String,
    default : null
},
active : {
    type : Boolean,
    default : false
},
info : {
    type : String,
    default : null
}
}, {
    timestamps : true
})


AdminSchema.methods.matchPassword = async function (enteredPass){
    return await bcrypt.compare(enteredPass, this.password)
}     

AdminSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
    })

   
 
export default model('Admins', AdminSchema);