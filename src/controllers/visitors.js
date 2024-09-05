import { errorMessage } from '../data/datas.js'
import VisitorsModel from '../schemas/visitors.js'


export class VisitorsContr{
    constructor(){};


    static async Get(req, res){
        try {
            res.send({
                status : 200,
                message : "Tashrif buyuruvchilar",
                success : true,
                data : await VisitorsModel.find()
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };

    static async Post(req, res){
        try {
            const { date } = req.body;
            if(!req.body){
                throw new Error(`Malumot yuboring`)
            }
            const newVisitor = await VisitorsModel.create({date});
            res.send({
                status : 201,
                message : "Muvofaqqiyatli qo'shildi",
                success : true,
                data : newVisitor
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }
}