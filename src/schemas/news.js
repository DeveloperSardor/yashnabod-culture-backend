import { model, Schema, Types } from "mongoose";



const NewSchema = new Schema({
    name : {
        type : String,
        required : [true, 'Required!']
    },
    desc : {
        type : String,
        default : null
    },
    files : [{
        type_file : {
            type : String,
            enum : ['audio', 'image', 'video']
        },
        link_file : {
            type : String
        }
    }],
    
}, {timestamps : true})



export default model('News', NewSchema)