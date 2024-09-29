import { model, Schema, Types } from "mongoose";



const AppealSchema = new Schema({
 group : {
    type : Types.ObjectId,
    ref : "Groups"
 },
 fullname : {
    type : String,
 },
 addedStudents : {
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
   //  match : /^998([378]{2}|(9[013-57-9]))\d{7}$/
 },

 message : {
    type : String
 }
}, {
timestamps : true
});


export default model('Appeals', AppealSchema) 
