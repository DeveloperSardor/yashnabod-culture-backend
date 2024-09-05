import { Schema, model } from "mongoose";


const VisitorSchema = new Schema({
date : {
    type : String
}
}, {
    timestamps : true
});



export default model('Visitors', VisitorSchema)