import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs';


const UserSchema = new Schema({
    username : {
        type : String,
        min : [3, "Firstname is too short!"],
        max : [30, "Firstname is too short!"]
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
    info : {
        type : String,
        default : null
    },
    img_path : {
        type : String,
        default : "uploads/user-deault.png" 
    },
    active : {
        type : Boolean,
        default : false
    },
    active_id : {
        type : String,
        default : null
    }
}, {timestamps : true})




UserSchema.methods.matchPassword = async function (enteredPass){
    return await bcrypt.compare(enteredPass, this.password)
}

UserSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
    })



export default model('Users', UserSchema)


