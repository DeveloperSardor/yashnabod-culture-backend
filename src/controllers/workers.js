import WorkersModel from '../schemas/workers.js'
import { errorMessage } from '../data/datas.js'
import JWT from '../utils/jwt.js'
import sendMail from '../utils/nodemailer.js';
import StudentModel from '../schemas/student.js'
import WorkerModel from '../schemas/workers.js'
import GroupsModel from '../schemas/groups.js'
import RolesModel from '../schemas/roles.js'
import fs from 'fs'

const confirmCode = Math.floor(Math.random() * 9000 + 1000);

export class WorkersContr{
    constructor(){}

    static async loginWorker(req, res){
        try {
            const { email, password } = req.body;
            if(!email || !password){
                throw new Error(`Ma'lumot to'liq jo'nating!`)
            }
            const worker = await WorkersModel.findOne({email}).populate('role').populate('center');
            console.log(worker.role);
            if(worker.role.title != 'Ustoz'){
                throw new Error(`Ustoz topilmadi!`)
            }
            if(worker && (await worker.matchPassword(password))){
                res.send({
                    status : 200,
                    message : "Muvofaqqiyatli kirdingiz",
                    success : true,
                    token : JWT.SIGN(worker._id),
                    data: worker
                })
            }else{
                throw new Error(`Email yoki parol xato`)
            }
            
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }





    static async getWorkers(req, res){
        try {
            const { id } = req.params;
            const { role, management }  = req.query;
            if(id){
             const findById = await WorkersModel.findById(id);
             if(findById == null){
               throw new Error(`Ichchi topilmadi`)
             }else{
                res.send({
                    status : 200,
                    message : "Id orqali ishchi",
                    success : true,
                    data : await WorkersModel.findById(id).populate('role').populate('center')
                })
             }
            }else if(management){
                const workers = await WorkersModel.find().populate('role')
              
                console.log(workers);
                res.send({
                    status : 200,
                    message : "Rahbariyat",
                    success : true,
                    data : workers
                })
            }
            else if(role){
                const teacherRole = await RolesModel.findOne({title : role})
                const workerByRole = await WorkerModel.find({role : teacherRole._id})
                res.send({
                    status : 200,
                    message : role,
                    success : true,
                    data : workerByRole
                })
            }
            else{
                const allWorkers = await WorkersModel.find().populate('role').populate('center');
                res.send({
                    status : 200,
                    message : "Barcha ishchilar",
                    success : true,
                    data : allWorkers
                })
            }
        } catch (error) {
             res.send(errorMessage(error.message))
        }
    }




    static async GetThreeBestTeachers(req, res){
        try {
        //  const
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }


   static async addWorker(req, res){
   try {
       const file = req.file;
       if(file && file.mimetype.split('/')[0]!=="image"){
          throw new Error(`Siz faqat rasm yuklay olasiz!`)
      }
     const { username, role,  email, phone, info, center, password} = req.body;
     console.log(req.body);
     if(!username  || !role  || !email || !phone || !center || !password){
        throw new Error(`Ma'lumot to'liq emas!`)
     }
     const checkEmail = await WorkerModel.findOne({email});
     if(checkEmail != null){
        throw new Error(`Bu email allaqachon mavjud!`)
     }
     const checkPhone = await WorkerModel.findOne({phone});
     if(checkPhone != null){
        throw new Error(`Bu telefon raqam allaqachon mavjud!`)
     }
     const newWorker = await WorkersModel.create({username, info, img_path : file ? file.destination + file.originalname : "uploads/user-default.png", role, email, password, phone, center});
     res.send({
        status : 201,
        message : "Ishchi muvofaqqatli qo'shildi!",
        success : true,
        data : newWorker
     }).status(201)
   } catch (error) {
    res.send(errorMessage(error.message))
   }
   }

   static async editMyData(req, res){
    try {
        const {token} = req.headers;
        const { id } = JWT.VERIFY(token);
        const findUser = await UsersModel.findById(id);
            if(findUser == null){
                throw new Error(`Foydalanuvchi topilmadi!`)
            }
            const file = req.file;
            if(file.mimetype.split('/')[0]!=="image"){
                throw new Error(`Siz faqatgina rasm yuklay olasiz!`)
            }
        const {username, img_path, role,  email, phone, center} = req.body;
        if(!username  && !img_path && !role && !email && !phone && !center){
            throw new Error(`malumot yuboring!`)
         }
         const editedProfile = await WorkersModel.findByIdAndUpdate(id, { username, img_path : file.destination + file.originalname, role, email, phone, center }, {new : true});
         res.send({
            status : 200,
            message : "Muvofaqqatli o'zgartirildi",
            success : true,
            data : editedProfile
         })
    } catch (error) {
         res.send(errorMessage(error.message))
    }
   }



   static async editWorker(req, res){
    try {
        const { id } = req.params;
        const findById = await WorkersModel.findById(id);
        if(findById == null){
            throw new Error(`Ishchi topilmadi`)
        }
        const file = req.file;
        if(file && file?.mimetype.split('/')[0] !=="image"){
            throw new Error(`Siz faqat rasm yuklay olasiz`)
        }
        // if(file){
        //     if(findById.img_path != 'uploads/user-default.png'){
        //         fs.unlink(findById.img_path, err=>{
        //             if(err){
        //                 return console.log(`Error: Rasm o'chirilmadi!`)
        //             }
        //         })
        //     }
        // }
        const {username, role,info,  email, phone, center} = req.body;
        console.log(role);
        if(!username  && !file && !role  && !email && !info && !phone && !center){
            throw new Error(`Malumot yuboring!`)
         }
         const editedProfile = await WorkersModel.findByIdAndUpdate(id, { username, img_path : file ?  file?.destination + file?.originalname : findById.img_path, role, email, phone, center, info }, {new : true});
         res.send({
            status : 200,
            message : "Muvofaqqatli o'zgartirildi",
            success : true,
            data : editedProfile
         })
    } catch (error) {
         res.send(errorMessage(error.message))
    }
   }

   static async deleteWorker(req, res){
    try {
        const {id} = req.params;
        const findById = await WorkersModel.findById(id);
        if(findById == null){
            throw new Error(`Ishchi topilmadi!`)
        }
        // if(findById.img_path != 'uploads/user-default.png'){
        //     fs.unlink(findById.img_path, (err)=>{
        //         if(err){
        //            return console.error(`Error: rasm o'chirilmadi! \n `, err)
        //         }
        //     })
        // }
        const deleted = await WorkersModel.findByIdAndDelete(id);
        res.send({
            status : 200,
            message : "Muvofaqqatli o'chirildi!",
            success : true,
            data : deleted
        })    
    } catch (error) {
        res.send(errorMessage(error.message))
    }
   }


}

