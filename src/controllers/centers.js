import { errorMessage } from '../data/datas.js';
import CentersModel from '../schemas/centers.js';
import GroupModel from '../schemas/groups.js'
import fs from 'fs'

export class CentersContr{
    constructor(){};
    static async GetCenters(req, res){
        try {
            const { id } = req.params;
            const { category, idQuery } = req.query;
            if(!id){
                res.send({
                    status : 200,
                    message : "Barcha markazlar",
                    success : true,
                    data : await CentersModel.find().sort({createdAt : -1})
                })
            }
            else{
                if(category){
                    res.send({
                        status : 200,
                        message : "Id orqali markaz ma'lumotlari",
                        success : true,
                        data : await GroupModel.find({center : id, category : category})
                   })
                }else if(idQuery){
                    console.log(idQuery);
                    res.send({
                        status : 200,
                        message : "OK",
                        success : true,
                        data : GroupModel.find({ center : idQuery })
                    })
                }
                else{
                    res.send({
                         status : 200,
                         message : "Id orqali markaz ma'lumotlari",
                         success : true,
                         data : await CentersModel.findById(id)
                    })
                }
            }
        } catch (error) {
             res.send(errorMessage(error.message))
        }
    }


    static async AddCenter(req, res){
        try {
            const {name, img_path, address} = req.body;
            const file = req.file;
            if(file.mimetype.split('/')[0] !== 'image'){
                throw new Error(`Faqatgina rasm yuklay olasiz`)
            }
            if(!name  || !address ){
                throw new Error(`Ma'lumot to'liq emas!`)
            }
            const newCenter = await CentersModel.create({name, img_path : file?.destination + file?.originalname, address});
            res.send({
                status : 201,
                message : "Muvofaqqiyatli qo'shildi",
                success : true,
                data : newCenter
            })
        } catch (error) {
            res.send(errorMessage(error.message))
        }
    }



  static async EditCenter(req, res){
    try {
        const { id } = req.params;
        console.log(id);
        const findById = await CentersModel.findById(id);
        if(findById == null){
            throw new Error(`Markaz topilmadi!`)
        }
        const file = req.file;
        if(file && file.mimetype.split('/')[0] !== "image"){
            throw new Error(`Faqatgina rasm yuklay olasiz`)
        }
        const {name, address} = req.body;
        if(!name   || !address ){
            throw new Error(`Ma'lumot yuborishingiz kerak!`)
        }
        if(findById == null){
            throw new Error(`Markaz topilmadi`)
        }else{
            if(file){
              fs.unlink(findById.img_path, err=>{
                if(err){
                    return console.log(`Error: Rasm o'chirilmadi`)
                }
              }) 
            }
            const editedCenter = await CentersModel.findByIdAndUpdate(id, {name, img_path : file ? file?.destination + file?.originalname : findById?.img_path, address}, {new : true})
            res.send({
                status : 200,
                message : "Markaz muvofaqqiyatli o'zgartirildi",
                success : true,
                data : editedCenter
            })
        }
    } catch (error) {
        res.send(errorMessage(error.message))
    }
  }

  static async DeleteCenter(req, res){
    try {
        const {id} = req.params;
        console.log(id);
        const findById = await CentersModel.findById(id);
        if(findById == null){
            throw new Error(`Markaz topilmadi`)
        }
        const deletedCenter = await CentersModel.findByIdAndDelete(id);
         res.send({
            status : 200,
            message : "Markaz muvofaqqiyatli o'chirildi!",
            success : true,
            data : deletedCenter
         })
         fs.unlink(findById.img_path, err=>{
            if(err){
                return console.log(`Error: Rasm o'chirilmadi`)
            }
         })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
  }

}