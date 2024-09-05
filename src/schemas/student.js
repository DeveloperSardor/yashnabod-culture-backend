import { model, Schema, Types } from "mongoose";



const StudentSchema = new Schema(
    {
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
        email : {
            type : String,
            trim : true,
            lowercase : true,
            unique : true,
            required : [true, 'Email address is required!'],
            match :  [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
        phone : {
            type : String,
            // match : /^998([378]{2}|(9[013-57-9]))\d{7}$/
        },
        info : {
            type : String,
            default : null
        },
        group : {
            type : Types.ObjectId,
            ref : "Groups"
        }
    },
    {
        timestamps : true
    }
)



export default model('Students', StudentSchema)