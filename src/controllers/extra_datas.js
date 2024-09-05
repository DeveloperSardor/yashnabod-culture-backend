import ExtraDataSchemas from '../schemas/extra_datas.js';
import { errorMessage } from '../data/datas.js';

export class ExtraDatasContr{
    constructor(){};

    static async Get(req, res){
        try {
            const data = await ExtraDataSchemas.findOne();
            res.send({
                status : 200,
                message : "Qo'shimcha ma'lumotlar",
                success : true,
                data 
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };

    static async Put(req, res){
        try {
            const {phone, address, email, socials} = req.body;
            if(!phone && !address && !email && !socials){
                throw new Error(`Ma'lumot yubormadingiz!`)
            }
            const get_id = await ExtraDataSchemas.findOne()
            const changed = await ExtraDataSchemas.findByIdAndUpdate(get_id._id, {phone, address, email, socials})
            res.send({
                status : 200,
                message : "Muvofaqqiyatli o'zgartirildi",
                success : true,
                data : changed 
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };


}