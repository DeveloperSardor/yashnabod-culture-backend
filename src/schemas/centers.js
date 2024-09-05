import { model, Schema, Types } from "mongoose";



const CenterSchema = new Schema({
name : {
    type : String,
    required : [true, 'Required field!']
},
img_path : {
    type : String,
    default : "uploads/center-img.jpg"
},
address : {
    latitude : {
        type : Number,
        required : [true, 'Required field!']
    },
    longitude : {
        type : Number,
        required : [true, 'Required field!'] 
    }
}
}, {
    timestamps : true
})



export default model('Centers', CenterSchema)