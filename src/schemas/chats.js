import { model, Schema, Types } from "mongoose";



const ChatSchema = new Schema({
    members : [{
        type : String
    }]
}, {timestamps : true})



export default model('Chats', ChatSchema)