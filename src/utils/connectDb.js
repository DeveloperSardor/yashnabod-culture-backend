import mongoose from "mongoose";


export default async function (){
    try {
        await mongoose.connect('mongodb+srv://sardor:f1jRaeKmdi0A2te0@cluster0.al2xvbw.mongodb.net/')
          console.log(`Successfuly connected to DB!`);
    } catch (error) {
        console.log('error');
        console.log(error.message);
    }
}