import { model, Schema, Types } from "mongoose";



const HomeworkSchema = new Schema({
student : {
    type : Types.ObjectId,
    ref : "Students"
},
attendence : {
    type : Types.ObjectId,
    ref : "Attendences"
},
isChecked : {
    type : Boolean,
    default : false
},
// reply // reaction,
text : {
    type : String,
    default : null
},
file_link : {
    type : String
},
file_type : {
    type : String,
    enum : ['image', 'video', 'audio', 'zip']
}
},
{timestamps : true}
)



export default model('Homework', HomeworkSchema)