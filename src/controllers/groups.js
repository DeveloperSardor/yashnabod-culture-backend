import GroupsModel from "../schemas/groups.js";
import { errorMessage } from "../data/datas.js";
import fs from "fs";

export class GroupsContr {
  constructor() {}

  static async Get(req, res) {
    try {
      const { id } = req.params;
      const { teacher, center, category } = req.query;
      if (id) {
        const findById = await GroupsModel.findById(id);
        if (findById == null) {
          throw new Error(`To'garak topilmadi!`);
        }
        res.send({
          status: 200,
          message: "To'garak malumoti",
          success: true,
          data: await GroupsModel.findById(id).populate('center'),
        });
      } else if (teacher) {
        const findGroup = await GroupsModel.findOne({ teacher });
        if (findGroup) {
          res.send({
            status: 200,
            message: "Ustoz to'garagi",
            success: true,
            data: findGroup,
          });
        } else {
          throw new Error(`To'garak topilmadi`);
        }
      } else if (center) {
        if (!category) {
          const findGroupFromCenter = await GroupsModel.find({ center });
          res.send({
            status: 200,
            message: "Markaz orqali to'garaklar",
            success: true,
            data: findGroupFromCenter,
          });
        } 
      } else if (category) {
        // Find groups by category
        const findGroupByCategory = await GroupsModel.find({ category }).populate("center");
        res.send({
          status: 200,
          message: "Tanlangan category bo'yicha to'garaklar",
          success: true,
          data: findGroupByCategory,
        });
      } else {
        // Fetch all groups
        res.send({
          status: 200,
          message: "All groups",
          success: true,
          data: await GroupsModel.find()
            .populate("teacher")
            .populate("center")
            .populate("category"),
        });
      }
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async Post(req, res) {
    try {
      const { name, category, center, days, price, teacher, time } = req.body;
      console.log(center);
      const file = req.file;
      if (file.mimetype.split("/")[0] !== "image") {
        throw new Error(`Faqatgina rasm yuklay olasiz`);
      }
      if (
        !name ||
        !file ||
        !category ||
        !center ||
        !days ||
        !price ||
        !teacher ||
        !time
      ) {
        throw new Error(`Ma'lumot to'liq emas`);
      }
      const addedGroup = await GroupsModel.create({
        name,
        img: file?.destination + file?.originalname,
        category,
        time,
        center,
        days: JSON.parse(days),
        price,
        teacher,
      });
      res.send({
        status: 201,
        message: "To'garak muvofaqqiyatli qo'shildi",
        success: true,
        data: addedGroup,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async Put(req, res) {
    try {
      const { id } = req.params;
      const findById = await GroupsModel.findById(id);
      if (findById == null) {
        throw new Error(`To'garak topilmadi`);
      }
      const file = req.file;
      if (file && file.mimetype.split("/")[0] !== "image") {
        throw new Error(`Faqatgina rasm yuklay olasiz`);
      }
      if (file) {
        fs.unlink(findById?.img, (err) => {
          if (err) {
            throw new Error(`Error: Rasm o'chirilmadi`);
          }
        });
      }
      const { name, category, center, days, price, teacher, time } = req.body;
      if (
        !name &&
        !category &&
        !center &&
        !days &&
        !time &&
        !price &&
        !teacher
      ) {
        throw new Error(`Ma'lumot yubormadingiz`);
      }
      const editedGroup = await GroupsModel.findByIdAndUpdate(
        id,
        {
          name,
          time,
          img: file ? file?.destination + file?.originalname : findById?.img,
          category,
          center,
          days: JSON.parse(days),
          price,
          teacher,
        },
        { new: true }
      );
      res.send({
        status: 200,
        message: "To'garak muvofaqqiyatli o'zgartirildi!",
        success: true,
        data: editedGroup,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async Delete(req, res) {
    try {
      const { id } = req.params;
      const findById = await GroupsModel.findById(id);
      if (findById == null) {
        throw new Error(`To'garak topilmadi`);
      }
      fs.unlink(findById.img, (err) => {
        if (err) {
          console.error("Error deleting file", err);
        } else {
          console.log("File deleted successfuly");
        }
      });
      const deletedGroup = await GroupsModel.findByIdAndDelete(id);
      res.send({
        status: 200,
        message: "To'garak muvofaqqiyatli o'chirildi!",
        success: true,
        data: deletedGroup,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }
}
