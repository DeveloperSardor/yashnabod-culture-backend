import ThemesModel from '../schemas/themes.js';
import { errorMessage } from '../data/datas.js';


export class ThemesContr{
    constructor(){};


    static async GetThemes(req, res){
        try {
            const { group } = req.params;
            const monthlyTheme = await ThemesModel.find({group});
            res.send({
                status : 200,
                message : "Mavzular",
                success : true,
                data : monthlyTheme
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };

    static async AddTheme(req, res){
        try {
            const { group, title, date } = req.body;
            if(!group || !title || !date){
                throw new Error(`Ma'lumot to'liq emas!`)
            }
            const addedTheme = await ThemesModel.create({group, title, date});
            res.send({
                status : 201,
                message : `Mavzu muvofaqqiyatli qo'shildi`,
                success : true,
                data : addedTheme
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };

    static async DeleteTheme(req, res){
        try {
            const { id } = req.params;
            const findTheme = await ThemesModel.findById(id);
            if(findTheme == null){
                throw new Error(`Mavzu topilmadi`)
            }
            const deletedTheme = await ThemesModel.findByIdAndDelete(id);
            res.send({
                status : 200,
                message : `Muvofaqqiyatli o'chirildi`,
                success : true,
                data : deletedTheme
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }
}