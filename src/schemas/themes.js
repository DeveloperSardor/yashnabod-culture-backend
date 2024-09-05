import { model, Schema, Types } from "mongoose";


const ThemeSchema = new Schema({
group : {
    type : Types.ObjectId,
    ref : "Groups"
},
title : {
    type : String
},
date : {
    type : String
}
}, {
    timestamps : true
});




export default model('Themes', ThemeSchema);