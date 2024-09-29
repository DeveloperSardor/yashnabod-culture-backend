import { errorMessage } from '../data/datas.js'
import AppealSchema from '../schemas/appeals.js'
import StudentSchema from '../schemas/student.js'



export class AppealContr{
    constructor(){};

    static async sendAppeal(req, res){
        try {
            const { group, fullname, email, phone, message } = req.body;
              console.log(req.body);
            if(!group || !fullname || !email || !phone ){
                throw new Error(`Malumot to'liq emas`)
            }
            const newAppeal = await AppealSchema.create({ group, fullname, email, phone, message });
            res.send({
                status : 201,
                message : "Ariza muvoffaqiyatli jo'natildi",
                success : true,
                data : newAppeal
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }

   
    static async GetAllApealAsAdmin(req, res){
        try {
            console.log('salom arizadan');
            const { id } = req.params;
            if(id){
                res.send({
                    status : 200,
                    message : "Arizalar",
                    success : true,
                    data : await AppealSchema.findById(id)
                })
            }else{
const appeals = await AppealSchema.find().populate('group').sort({ _id: -1 });
                res.send({
                    status : 200,
                    message : "Arizalar",
                    success : true,
                    data : appeals
                })
            }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }

    static async DeleteAppealAsAdmin(req, res){
        try {
            const { id } = req.params;
            const findAppeal = await AppealSchema.findById(id);
            if(findAppeal == null){
                throw new Error(`Ariza topilmadi`)
            }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }

 
    static async AppealToStudents(req, res){
        try{
            const { id } = req.params;
            const findAppeal = await AppealSchema.findById(id);
            await AppealSchema.findByIdAndUpdate(id, { addedStudents : true }, { new : true })
            const newStudent = await StudentSchema.create({ username : findAppeal.fullname, email : findAppeal.email, phone : findAppeal.phone, group : findAppeal.group })

            res.send({
                status : 200,
                success : true,
                message : "O'quvchilar qatoriga qo'shildi!",
                data : newStudent
            })
        }catch(error){
            res.send(errorMessage(error.message))
        }
    }



}
