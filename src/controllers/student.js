import studentsModel from '../schemas/student.js'
import { errorMessage } from '../data/datas.js'
import JWT from '../utils/jwt.js'
import fs from 'fs'
import student from '../schemas/student.js';


export class StudentContr{
    constructor(){}



    static async statisticStudents(req, res){
        try {
            const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
            const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);      
              const users = await studentsModel.find();
                // Har bir foydalanuvchining qo'shilgan vaqtlarini filtr qilish
        const monthlyData = users.map((user) => {
            const userCreatedDates = user.createdData.filter((data) => {
                const dataDate = new Date(data.createdAt);
                return dataDate >= startOfMonth && dataDate <= endOfMonth;
            });

            return {
                count: userCreatedDates.length,
                createdAt: user.username,
            };
        });

        // Sana bo'yicha tartiblash
        const sortedData = monthlyData.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateA - dateB;
        });


        res.send(sortedData)

        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }

  
      static async getStudents(req, res){
        try {
            const {id} = req.params;
            const {search, group} = req.query;
            if(id){
             const findById = await studentsModel.findById(id);
             if(findById == null){
                throw new Error(`O'quvchi topilmadi`)
             }
             res.send({
                status : 200,
                message : "Id orqali o'quvchi ma'lumotlari",
                success : true,
                data : await studentsModel.findById(id).populate('group')
             })
            }else if(group){
                 const students = await studentsModel.find({ group });
                 res.send({
                    status : 200,
                    message : "O'quvchilarim",
                    success : true,
                    data : students
                 })
            }
            else if(search){
                const keyword = search ? {
                    $or : [
                        {username : { $regex : search, $options : "i" }},
                        {info : { $regex : search, $options : "i" }},
                        {email : {$regex : search, $options : "i"}}
                    ]
                } : {}
                res.send({
                    status : 200,
                    message : "Qidiruv natijasida topilgan o'quvchilar",
                    success : true,
                    data : await studentsModel.find(keyword).populate('group')
                })
            }else{
              res.send({
                 status : 200,
                 message : "O'quvchi",
                 success : true,
                 data : await studentsModel.find().populate('group')
              })
            }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
      }

      


      static async addStudent(req, res){
        try {
            const file = req.file;
            if(file && file.mimetype.split('/')[0]!=="image"){
                throw new Error(`Siz faqat rasm yuklay olasiz!`)
            }
             const {username, email, phone, info, group} = req.body;
             if( !username || !email || !phone || !group){
                throw new Error(`Ma'lumot to'liq emas!`)
             }
             
             
             const addedStudent = await studentsModel.create({group, username, img_path : file ? file.destination + file.originalname : "uploads/user-default.png", email, phone, info})
             res.send({
                status : 201,
                message : "O'quvchi muvofaqqiyatli qo'shildi",
                success : true,
                data : addedStudent
             })
        } catch (error) {
           res.send(errorMessage(error.message))
        }
      }
        
      static async editStudent(req, res){
        try {
            const { id } = req.params
            const file = req.file;
            if(file && file.mimetype.split('/')[0]!=="image"){
                throw new Error(`Siz faqatgina rasm yuklay olasiz!`)
            }
            const {username, email, phone, info} = req.body;
            if(!username  && !file && !email && !phone && !info){
                throw new Error(`Ma'lumot yuborishingiz kerak!`)
            }
            const findById = await studentsModel.findById(id);
            if(findById == null){
                throw new Error(`O'quvchi topilmadi`)
            }
            if(file){
                if(findById.img_path !='uploads/user-default.png'){
                    fs.unlink(findById.img_path, err=>{
                        if(err){
                            return console.log(`Error : Rasm o'chirilmadi`)
                        }
                    })
                }
            }
            const editedProfile = await studentsModel.findByIdAndUpdate(id, { username, img_path : file && file.destination + file.originalname, email, phone, info}, {new : true})
            res.send({
                status : 200,
                message : "O'quvchi muvofaqqiyatli o'zgartirildi",
                success : true,
                data : editedProfile
            })

        } catch (error) {
            res.send(errorMessage(error.message))
        }
      }

      static async deleteStudent(req, res){
        try {
            const { id } = req.params;
            const findStudent = await studentsModel.findById(id);
            if(findStudent == null){
                throw new Error(`O'quvchi topilmadi`)
            }
            const deletedStudent = await studentsModel.findByIdAndDelete(id);
            res.send({
                status : 200,
                message : "O'quvchi muvofaqqiyatli o'chirildi",
                success : true,
                data : deletedStudent
            })
            if(findStudent.img_path != 'uploads/user-default.png'){
                fs.unlink(findStudent.img_path, err=>{
                    if(err){
                      return console.log(`Error : Rasm o'chirilmadi`)
                    }
                })
            }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
      }



}