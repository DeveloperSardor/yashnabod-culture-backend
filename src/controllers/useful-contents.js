import UsefulContentModel from '../schemas/useful-contents.js'
import { errorMessage } from '../data/datas.js'
import JWT from '../utils/jwt.js';
import fs from 'fs'


export class UsefulContentContr{
    constructor(){};

    static async getContents(req, res){
        try {
            const { id } = req.params;
            if(id){
               const findById = await UsefulContentModel.findById(id);
               if(findById == null){
                  throw new Error(`Kontentlar topilmadi`)
               }else{
                   res.send({
                    status : 200,
                    message : "Foydali kontentlar",
                    success : true,
                    data : findById
                   })
               }
            }else{
                res.send({
                    status : 200,
                    message : "Barcha kontentlar",
                    success : true,
                    data : await UsefulContentModel.find()
                })
            }
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }


static async addContent(req, res){
    try {  
       const {name, desc, youtube_link} = req.body;
       const file = req.file;
       if(!name || !desc ){
        throw new Error(`Ma'lumot to'liq emas!`)
       }
       if(!youtube_link && !file){
           throw new Error(`Video talab qilinadi!`)
       }
       if(file && file.mimetype.split('/')[0]!='video'){
        throw new Error(`Faqat video yuklang!`)
       }
      
       const addedNew = await UsefulContentModel.create({name, youtube_link : youtube_link ? youtube_link : null, desc, file :  file ?  file.destination + file.originalname : null});
       res.send({
        status : 201,
        message : "Manba muvofaqqiyatli qo'shildi",
        success : true,
        data : addedNew
       })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}


static async editContents(req, res){
    try{
        const { id } = req.params;
        const findById = await UsefulContentModel.findById(id);
        if(findById == null){
            throw new Error(`Manba topilmadi`)
        }
        const { file } = req.file;
        const {name, desc, youtube_link} = req.body;
        if(!name && !desc && !youtube_link && !file){
            throw new Error(`Ma'lumot yubormadingiz`)
        }
       
        if(file && file.mimetype.split('/')[0]!= 'video'){
            throw new Error(`Faqatgina video yuklay olasiz!`)
        } 
        if(file){
            fs.unlink(findById.file, (err)=>{
                if(err){
                    return console.log(`Error: Video o'chirilmadi`)
                }
            })
        }
        const editedNew = await UsefulContentModel.findByIdAndUpdate(id, { name, desc, file : file ? file.destination + file.originalname : null, youtube_link : youtube_link ? youtube_link : null }, {new : true})
        res.send({
            status : 200,
            message : "Manba muvofaqqiyatli o'zgartirildi",
            success : true,
            data : editedNew
        })
    }catch(err){
        res.send(errorMessage(err.message))
    }
}


static async deleteContent(req, res){
    try {
        const { id } = req.params;
        const findById = await UsefulContentModel.findById(id);
        if(findById == null){
            throw new Error(`Manba topilmadi`)
        }
        const deletedNew = await UsefulContentModel.findByIdAndDelete(id);
        res.send({
            status : 200,
            message : "Manba muvofaqqiyatli o'chirildi",
            success : true,
            data : deletedNew
        })
        fs.unlink(findById.file, err=>{
            if(err){
                return console.log(`Error: Video o''chirilmadi!`)
            }
        })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}


}