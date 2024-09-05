import { model, Schema, Types } from "mongoose";



const MessageSchema = new Schema({
chat : {
    type : Types.ObjectId,
    ref : "Chats"
},
sender : {
    type : String
},
message : {
    type : String,
    default : null
},
type_file : {
    type : String,
    // enum : ['audio', 'image', 'video'],
},
link_file : {
    type : String,
    default : null
}
}, {
    timestamps : true
})



export default model('Messages', MessageSchema)