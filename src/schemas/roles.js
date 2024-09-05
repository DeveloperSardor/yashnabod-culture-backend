import { Schema, model } from "mongoose";


const RolesSchema = new Schema({
title : {
    type : String
}
}, 
{
    timestamps : true
})


export default model('Roles', RolesSchema);