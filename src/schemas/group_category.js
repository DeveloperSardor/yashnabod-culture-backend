import { model, Schema, Types } from "mongoose";



const GroupCategorySchema = new Schema({
name : {
    type : String,
    required : [true, 'Required field!']
}
}, {
    timestamps : true
})



export default model('GroupCategories', GroupCategorySchema)