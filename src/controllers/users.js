import { errorMessage } from '../data/datas.js'
import JWT from '../utils/jwt.js'
import UsersModel from '../schemas/users.js'
import fs from 'fs'


export class UsersContr{
    constructor(){};

    static async Register(req, res){
        try {
            const { username, email, password } = req.body;
            if(!username || !email || !password ){
                throw new Error(`Ma'lumot to'liq emas!`)
            }
            const checkEmail = await UsersModel.findOne({email});
            if(checkEmail){
                throw new Error(`Email band!`)
            }
            const newUser = await UsersModel.create({username, email, password});
            res.send({
                status : 201,
                message : "Muvofaqqatli ro'yxatdan o'tdingiz",
                success : true,
                data : newUser,
                token : JWT.SIGN(newUser._id)
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };

    static async Login(req, res){
        try {
            const {email, password} = req.body;
            if(!email || !password){
                throw new Error(`Ma'lumot to'liq emas!`)
            }
           const user = await UsersModel.findOne({email});
           if(user && (await user.matchPassword(password))){
            res.send({
                status : 200,
                message : "ok",
                success : true,
                token : JWT.SIGN(user._id),
                data: user
            })
           }else{
            throw new Error(`Email yoki parol xato!`)
           }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };
  
    static async GetAllUsers(req, res){
        try {
            const { id } = req.params;
            const { search } = req.query;
            if(id){
                const findById = await UsersModel.findById(id);
                if(findById == null){
                    throw new Error(`Foydalanuvchi topilmadi!`)
                }
                res.send({
                    status : 200,
                    message : "Id orqali foydalanuvchi ma'lumotlari",
                    success : true,
                    data : findById
                })
            }
            else if(search){
                const keyword = search ? {
                    $or : [
                        {username : {$regex : search, $options : "i"}},
                        {email : {$regex : search, $options : "i"}},
                        {}
                    ]
                } : {};
                const searchResult = await UsersModel.find(keyword);
                res.send({
                    status : 200,
                    message : "Qidiruv natijasida topilgan ma'lumotlar",
                    success : true,
                    data : searchResult
                })
            }
            else{
                res.send({
                    status : 200,
                    message : "Barcha foydalanuvchilar",
                    success : true,
                    data : await UsersModel.find()
                })
            }

        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };

    static async GetMyProfile(req, res){
        try {
            const { token } = req.headers;
            if(!token){
             throw new Error(`Token yuborishingiz shart!`)   
            }
            const { id } = JWT.VERIFY(token);
            const findUser = await UsersModel.findById(id);
            if(findUser == null){
                throw new Error(`Foydalanuvchi topilmadi!`)
            }
            res.send({
                status :  200,
                message : "Mening profilim",
                success : true,
                data : findUser
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    };

    static async EditMyProfile(req, res){
        try {
            const { token } = req.headers;
            if(!token){
             throw new Error(`Token yuborishingiz shart!`)   
            }
            const { id } = JWT.VERIFY(token);
            const findUser = await UsersModel.findById(id);
            if(findUser == null){
                throw new Error(`Foydalanuvchi topilmadi!`)
            }
            const file = req.file;
            if(file.mimetype.split('/')[0]!=="image"){
                throw new Error(`Faqatgina rasm fayl yuklay olasiz!`)
            }
            if(file){
                if(findUser.img_path != 'uploads/user-default.png'){
                    fs.unlink(findUser.img_path, err=>{
                       if(err){
                           return console.log(`Error: Rasm o'chirilmadi`)
                       }
                    })
                }
            }
            const { username, email, info } = req.body;
            if(!username && !email && !info && !file){
                throw new Error(`Hech qanday ma'lumot yubormadingiz!`)
            }
            const edited = await UsersModel.findByIdAndUpdate(id, {username, email, info, img_path : file.destination + file.originalname });
            res.send({
                status : 200,
                message : "Muvofaqqatli o'zgartirildi",
                success : true,
                data : edited
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }


    static async DeleteMyProfile(req, res){
        try {
            const { token } = req.headers;
            if(!token){
             throw new Error(`Token yuborishingiz kerak!`)   
            }
            const { id } = JWT.VERIFY(token);
            const findUser = await UsersModel.findById(id);
            if(findUser == null){
                throw new Error(`Foydalanuvchi topilmadi!`)
            }
            
            const deleted = await UsersModel.findByIdAndDelete(id);
            res.send({
                status : 200,
                message : "Muvofaqqatli o'chirildi",
                success : true,
                data : deleted
            })
            if(findUser.img_path != 'uploads/user-default.png'){
                fs.unlink(findUser.img_path, err=>{
                    if(err){
                        return console.log(`Error: Rasm o'chirilmadi`)
                    }
                })
            }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }



}