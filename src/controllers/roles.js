import RolesSchema from '../schemas/roles.js'
import { errorMessage } from '../data/datas.js'



export class RolesContr{
    constructor(){};

    static async GetRoles(req, res){
        try {
            res.send({
                status : 200,
                message : "Lavozimlar",
                success : true,
                data : await RolesSchema.find()
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }

    static async AddRole(req, res){
        try {
            const {title} = req.body;
            if(!title){
                throw new Error(`Ma'lumot yubormadingiz!`)
            }
            const newRole = await RolesSchema.create({title});
            res.send({
                status : 201,
                message : "Lavozim muvofaqqiyatli o'zgartirildi",
                success : true,
                data : newRole
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }


    static async EditRole(req, res){
        try {
            const {id} = req.params;
            const {title} = req.body;
            if(!title){
                throw new Error(`Ma'lumot yubormadingiz!`)
            }
            const findRole = await RolesSchema.findById(id);
            if(findRole == null){
                throw new Error(`Lavozim topilmadi`)
            }
            const edited = await RolesSchema.findByIdAndUpdate(id, {title}, {new : true});
            res.send({
                status : 200,
                message : "Lavozim muvofaqqiyatli o'zgartirildi",
                success : true,
                data : edited
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }

    static async DeleteRole(req, res){
        try {
            const {id} = req.params;const findRole = await RolesSchema.findById(id);
            if(findRole == null){
                throw new Error(`Lavozim topilmadi`)
            }
            const deletedRole = await RolesSchema.findByIdAndDelete(id);
            res.send({
                status : 200,
                message : "Lavozim muvofaqqiyatli o'chirildi",
                success : true,
                data : deletedRole
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }
}