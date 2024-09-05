import { errorMessage } from "../data/datas.js";
import PlaceSchema from "../schemas/places.js";
import fs from 'fs'

export class PlacesContr {
  constructor() {}

  static async GetCulturalHeritages(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        let findById = await PlaceSchema.findById(id);
        if (findById == null) {
          throw new Error(`Madaniy meros topilmadi`);
        } else {
          res.send({
            status: 200,
            message: "Madaniy meros malumotlar",
            success: true,
            data: findById,
          });
        }
      } else {
        res.send({
          status: 200,
          message: "Madaniy meroslar",
          success: true,
          data: await PlaceSchema.find({ type: "Madaniy meroslar" }),
        });
      }
    } catch (err) {
      res.send(errorMessage(err.message));
    }
  }

  static async GetAmusementParks(req, res) { 
    try {
      const { id } = req.params;
      if (id) {
        let findById = await PlaceSchema.findById(id);
        if (findById == null) {
          throw new Error(`Ko'ngil ochar istirohat bog'i topilmadi`);
        } else {
          res.send({
            status: 200,
            message: "Ko'ngil ochar istirohat bog'i malumotlari",
            success: true,
            data: findById,
          });
        }
      } else {
        res.send({
          status: 200,
          message: "Ko'ngil ochar istirohat bog'lari",
          success: true,
          data: await PlaceSchema.find({
            type: "Ko'ngil ochar istirohat bog'lari",
          }),
        });
      }
    } catch (err) {
      res.send(errorMessage(err.message));
    }
  }

  static async AddCulturalHeritages(req, res) {
    try {
        const file = req.file;
       if(file && file.mimetype.split('/')[0]!=="image"){
          throw new Error(`Siz faqat rasm yuklay olasiz!`)
      }
      const { title, desc } = req.body;
      if (!title || !file || !desc) {
        throw new Error(`Madaniy meros malumotlari talab qilinadi`);
      }
      const added = await PlaceSchema.create({
        title,
        img : file.destination + file.originalname,
        desc,
        type: "Madaniy meroslar",
      });
      res.send({
        status: 201,
        message: "Madaniy meros qo'shildi",
        success: true,
        data: added,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async AddAmusementParks(req, res) {
    try {
        const file = req.file;
       if(file && file.mimetype.split('/')[0]!=="image"){
          throw new Error(`Siz faqat rasm yuklay olasiz!`)
      }
      const { title, desc } = req.body;
      if (!title || !file || !desc) {
        throw new Error(
          `Barcha malumotlar talab qilinadi`
        );
      }
      const added = await PlaceSchema.create({
        title,
        img : file.destination + file.originalname,
        desc,
        type: "Ko'ngil ochar istirohat bog'lari",
      });
      res.send({
        status: 201,
        message: "Ko'ngil ochar istirohat bog' qo'shildi",
        success: true,
        data: added,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async EditPlaces(req, res) {
    try {
      const { id } = req.params;
      const findById = await PlaceSchema.findById(id);
      if (findById == null) {
        throw new Error(`Topilmadi!`);
      }
      const file = req.file;
      if(file && file?.mimetype.split('/')[0] !=="image"){
        throw new Error(`Siz faqat rasm yuklay olasiz`)
    }
    if(file){
          fs.unlink(findById.img, err=>{
                if(err){
                    return console.log(`Error: Rasm o'chirilmadi!`)
                }
            })
    }
      const { title, desc } = req.body;
      if (!title && !file && !desc) {
        throw new Error(`O'zgartirish uchun malumot yuboring!`);
      }
      const updated = await PlaceSchema.findByIdAndUpdate(
        id,
        { title, img : file ? file.destination + file.originalname : findById.img, desc },
        { new: true }
      );
      res.send({
        status: 200,
        message: "Muvofaqqiyatli o'zgartirildi",
        success: true,
        data: updated,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }
  static async DeletePlaces(req, res) {
    try {
      const { id } = req.params;
      const findById = await PlaceSchema.findById(id);
      if (findById == null) {
        throw new Error(`Topilmadi!`);
      }
      fs.unlink(findById.img, (err)=>{
        if(err){
           return console.error(`Error: rasm o'chirilmadi! \n `, err)
        }
    })

      const deleted = await PlaceSchema.findByIdAndDelete(id);
      res.send({
        status: 200,
        message: "Muvofaqqiyatli o'chirildi",
        success: true,
        data: deleted,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }
}
