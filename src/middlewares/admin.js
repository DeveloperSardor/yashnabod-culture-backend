import { errorMessage } from "../data/datas.js"
import JWT from '../utils/jwt.js'
import AdminModel from '../schemas/admin.js'


export default async(req, res, next)=>{
try {
    const { token } = req.headers;
    const { id } = JWT.VERIFY(token);
    const findAdmin = await AdminModel.findOne();
    if(findAdmin._id != id){
        throw new Error(`You're not admin!`)
    }else{
       next()
    }
} catch (error) {
    res.send(errorMessage(error.message))
}
}