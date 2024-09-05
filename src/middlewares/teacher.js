import { errorMessage } from "../data/datas.js"
import JWT from '../utils/jwt.js'
import TeacherModel from '../schemas/workers.js'


export default async(req, res, next)=>{
try {
    const { token } = req.headers;
    const { id } = JWT.VERIFY(token);
    let findAdmin = await TeacherModel.findById(id);
    if(findAdmin == null){
        throw new Error(`You're not teacher!`)
    }else{
       next()
    }
} catch (error) {
    res.send(errorMessage(error.message))
}} 