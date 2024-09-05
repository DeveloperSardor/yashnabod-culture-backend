import { model, Schema, Types } from "mongoose";
import bcrypt from 'bcryptjs'



const WorkerSchema = new Schema({
username : {
    type : String,
    min : [3, "Username is too short!"],
    max : [30, "Username is too short!"]
},
img_path : {
    type : String,
    default : "uploads/user-default.png"
},
active_id : {
    type : String,
    default : null  
},
active : {
    type : Boolean,
    default : false
}, 
role : {
    type : Types.ObjectId,
    ref : "Roles"
},
// salary : {  
//     type : Number
// },
info : {
    type : String,
    default : "Ma'lumot yo'q"
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
phone : {
    type : String,
    match : /^998([378]{2}|(9[013-57-9]))\d{7}$/
},
center : {
    type : Types.ObjectId,
    ref : "Centers"
},
}, {
    timestamps : true
})


WorkerSchema.methods.matchPassword = async function (enteredPass){
    return await bcrypt.compare(enteredPass, this.password)
}

WorkerSchema.pre('save', async function(next){
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt)
        this.password = hashedPassword
        next()
    } catch (error) {
        next(error)
    }
    })


    // $2b$10$VwXDxuBkhfWnvSUyCAVgwuC43oInvKvYZXKTWKAojsLhKpoVEU2By
 


    console.log(await bcrypt.hash('23262911', await bcrypt.genSalt(10)))

export default model('Workers', WorkerSchema)