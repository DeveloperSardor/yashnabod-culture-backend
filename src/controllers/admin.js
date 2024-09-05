import AdminModel from "../schemas/admin.js";
import { errorMessage } from "../data/datas.js";
import JWT from "../utils/jwt.js";
import bcrypt from "bcryptjs";
import fs from 'fs'

export class AdminContr {
  constructor() {}

  static async Login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        throw new Error(`Ma'lumot to'liq jo'nating!`);
      }
      const user = await AdminModel.findOne({ email });
      if (user && (await user.matchPassword(password))) {
        res.send({
          status: 200,
          message: `Muvofaqqiyatli kirdingiz`,
          success: true,
          token: JWT.SIGN(user._id),
          data: user,
        });
      } else {
        throw new Error(`Email yoki parol xatodir!`);
      }
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async GetMyProfile(req, res) {
    try {
      const { token } = req.headers;
      const { id } = JWT.VERIFY(token);
      const findAdmin = await AdminModel.findById(id);
      if (findAdmin == null) {
        throw new Error(`Admin topilmadi`);
      } else {
        res.send({
          status: 200,
          message: "Admin ma'lumotlari",
          success: true,
          data: findAdmin,
        });
      }
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async EditMyProfile(req, res) {
    try {
      const { token } = req.headers;
      const { id } = JWT.VERIFY(token);
      const file = req.file;
      if (file.mimetype.split("/")[0] !== "image") {
        throw new Error(`Faqatgina rasm yuklay olasiz`);
      }
      const { username, img_path, email, password, info } = req.body;
      const findAdmin = await AdminModel.findById(id);
      if (findAdmin == null) {
        throw new Error(`Admin topilmadi`);
      } else {
        if(img_path){
          if(findAdmin.img_path != 'uploads/user-default.png'){
            fs.unlink(findAdmin.img_path, (err)=>{
              if(err){
                return console.log(`Error: Rasm o'chmadi`)
              }
            })
          }
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedAdmin = await AdminModel.findByIdAndUpdate(
          id,
          {
            username,
            img_path: file.destination + file.originalname,
            email,
            password: hashedPassword,
            info,
          },
          { new: true }
        );
        res.send({
          status: 200,
          message: "Muvofaqqatli o'zgartirildi",
          success: true,
          data: updatedAdmin,
        });
      }
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }
}
