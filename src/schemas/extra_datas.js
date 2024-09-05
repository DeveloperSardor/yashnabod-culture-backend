import { model, Schema, Types } from "mongoose";



const ExtraDataSchema = new Schema({
phone : {
    type : String,
     match : /(?:\+\([9]{2}[8]\)[0-9]{2}\ [0-9]{3}\-[0-9]{2}\-[0-9]{2})/g
},
address : {
    type : String
},
email : {
    type : String,
    trim : true,
    lowercase : true,
    unique : true,
    required : [true, 'Email address is required!'],
},
socials : [
    {
        instagram :  {
            type : String,
            default : null
        },
        facebook : {
            type : String,
            default : null
        },
        youtube : {
            type : String,
            default : null
        },
        telegram : {
            type : String,
            default : null
        },
    }
]
}, {
    timestamps : true
})




export default model('ExtraDatas', ExtraDataSchema)