import { model, Schema } from 'mongoose';



const DocsSchema = new Schema({
title : {
    type : String
},
number : {
    type : Number
},
category : {
    type : String,
    enum : ['Sohaga oid qonunlar', "Prezident farmonlari, qarorlari va namoyishlari"]
},
link : {
    type : String,
    default : null
},
file : {
    type : String,
    default : null 
},
date : {
    type : Date
}
}, {
    timestamps : true
});




export default model('Docs', DocsSchema);