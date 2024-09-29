import { Schema, model, Types } from "mongoose";


const PlaceSchema = new Schema({
title : {
    type : String
},
img : {
    type : String
},
desc : {
    type : String
},
type : {
    type : String,
    enum : ["Ko'ngil ochar istirohat bog'lari", "Madaniy meroslar"]
},
link : {
    type : {
        String,
    }
}
}, {
    timestamps : true
})


export default model('Places', PlaceSchema)
