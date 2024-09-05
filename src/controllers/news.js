import NewsModel from '../schemas/news.js'
import { errorMessage } from '../data/datas.js'
import JWT from '../utils/jwt.js';
import fs from 'fs'


export class NewsContr{
    constructor(){};

    static async getNews(req, res){
        try {
            const { id } = req.params;
            if(id){
               const findById = await NewsModel.findById(id);
               const otherNews = await (await NewsModel.find().sort({createdAt : -1}).limit(5)).filter(el=>el._id !=id)
               if(findById == null){
                  throw new Error(`Yangilik topilmadi`)
               }else{
                   res.send({
                    status : 200,
                    message : "Yangilik ma'lumoti",
                    success : true,
                    data : {
                        data : findById,
                        otherNews
                    },
                   })
               }
            }else{
                res.send({
                    status : 200,
                    message : "Barcha yangiliklar",
                    success : true,
                    data : await NewsModel.find()
                })
            }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }


static async addNews(req, res){
    try {  
       const {name, desc} = req.body;
       const files = req.files;
       if(!name || !desc || !files){
        throw new Error(`Ma'lumot to'liq emas!`)
       }
       console.log(files );
       const files_data = files?.map((el, idx)=>{
        return {
            type_file : el.mimetype.split('/')[0],
            link_file : el.destination + el.originalname
        }
       })
       const addedNew = await NewsModel.create({name, desc, files : files_data});
       res.send({
        status : 201,
        message : "Yangilik muvofaqqiyatli qo'shildi",
        success : true,
        data : addedNew
       })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}


static async editNews(req, res){
    try{
        const { id } = req.params;
        const findById = await NewsModel.findById(id);
        if(findById == null){
            throw new Error(`Yangilik topilmadi`)
        }
        const {name, desc, files} = req.body;
        if(!name && !desc && !files){
            throw new Error(`Ma'lumot yubormadingiz`)
        }
        const files_data = files?.map((el, idx)=>{
            return {
                type_file : el.mimetype.split('/')[0],
                link_file : el.destination + el.originalname
            }
           })
           if(files){
            const link_files = findById.files.map(el=> el.link_file);
            link_files.forEach(el=>{
                fs.unlink(el, (err)=>{
                    if(err){
                        return console.log(`Fayl o'chirilmadi`)
                    }
                })
        })
           }
        const editedNew = await NewsModel.findByIdAndUpdate(id, { name, desc, files : files_data }, {new : true})
        res.send({
            status : 200,
            message : "Yangilik muvofaqqiyatli o'zgartirildi",
            success : true,
            data : editedNew
        })
    }catch(err){
        res.send(errorMessage(err.message))
    }
}


static async deleteNews(req, res){
    try {
        const { id } = req.params;
        const findById = await NewsModel.findById(id);
        if(findById == null){
            throw new Error(`Yangilik topilmadi`)
        }
        const deletedNew = await NewsModel.findByIdAndDelete(id);
        res.send({
            status : 200,
            message : "Yangilik muvofaqqiyatli o'chirildi",
            success : true,
            data : deletedNew
        })
        const link_files = findById.files.map(el=> el.link_file);
        link_files.forEach(el=>{
            fs.unlink(el, (err)=>{
                if(err){
                    return console.log(`Fayl o'chirilmadi`)
                }
            })
        })
    } catch (error) {
        res.send(errorMessage(err.message))
    }
}


}