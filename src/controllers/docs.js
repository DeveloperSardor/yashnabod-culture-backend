import { errorMessage } from "../data/datas.js";
import DocsModel from "../schemas/docs.js";
import fs from "fs";

export class DocsContr {
  constructor() {}

  static async Get(req, res) {
    try {
      res.send({
        status: 200,
        message: "Hujjatlar",
        success: true,
        data: await DocsModel.find(),
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  
  static async GetPresidental(req, res) {
    try {
      res.send({
        status: 200,
        message: "Hujjatlar",
        success: true,
        data: await DocsModel.find({
          category: "Prezident farmonlari, qarorlari va namoyishlari",
        }),
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async GetIndustrial(req, res) {
    try {
      res.send({
        status: 200,
        message: "Hujjatlar",
        success: true,
        data: await DocsModel.find({ category: "Sohaga oid qonunlar" }),
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async Post(req, res) {
    try {
      const { title, number, category, date, link } = req.body;
      // const file = req.file;
      if (!title || !number || !category || !link) {
        throw new Error(`Ma'lumot to'liq emas!`);
      }
      const newDoc = await DocsModel.create({
        title,
        date,
        number,
        category,
        link,
      });
      res.send({
        status: 201,
        message: "Muvofaqqiyatli qo'shildi",
        success: true,
        data: newDoc,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async Put(req, res) {
    try {
      const { id } = req.params;
      const findDoc = await DocsModel.findById(id);
      if (findDoc == null) {
        throw new Error(`Topilmadi!`);
      }
      const file = req.file;
      const { title, number, category, link } = req.body;
      if (!title && !number && !category && !link) {
        throw new Error(`Ma'lumot jo'natishingiz kerak!`);
      }
      if (file) {
        fs.unlink(findDoc.file, (err) => {
          if (err) {
            return console.log(`Fayl o'chirilmadi!`);
          }
        });
      }
      const updatedDoc = await DocsModel.findByIdAndUpdate(id, {
        title,
        number,
        category,
        file,
        link,
      });
      res.send({
        status: 200,
        message: `Muvofaqqiyatli o'zgartirildi`,
        success: true,
        data: updatedDoc,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async Delete(req, res) {
    try {
      const { id } = req.params;
      const findDoc = await DocsModel.findById(id);
      if (findDoc == null) {
        throw new Error(`Topilmadi!`);
      }
      const deletedDoc = await DocsModel.findByIdAndDelete(id);
      res.send({
        status: 200,
        message: `Muvofaqqiyatli o'chirildi`,
        success: true,
        data: deletedDoc,
      });
      if (findDoc.file) {
        fs.unlink(findDoc.file, (err) => {
          if (err) {
            return console.log(`Error: Fayl o'chirilmadi!`);
          }
        });
      }
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }
}
