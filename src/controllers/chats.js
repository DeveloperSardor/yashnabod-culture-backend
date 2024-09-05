import ChatsModel from "../schemas/chats.js";
import UserModel from "../schemas/users.js";
import AdminModel from "../schemas/admin.js";
import WorkerModel from "../schemas/workers.js";
import JWT from "../utils/jwt.js";
import { errorMessage } from "../data/datas.js";

export class ChatContr {
  constructor() {}

  static async createChat(req, res) {
    try {
      const { receiverId } = req.body;
      const { token } = req.headers;
      const { id } = JWT.VERIFY(token);
      const existingChat = await ChatsModel.findOne({
        members: [id, receiverId],
      });
      if (!existingChat || existingChat.length === 0) {
        const newChat = await ChatsModel.create({ members: [receiverId, id] });
        res.send({
          status: 201,
          message: "Chat muvofaqqiyatli qo'shildi",
          success: true,
          data: newChat,
        });
      }
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async connectWithAdmin(req, res) {
    try {
      const { token } = req.headers;
      const { id } = JWT.VERIFY(token);
      const isAdmin = await AdminModel.findById(id);
      const isTeacher = await TeacherModel.findById(id);
      const isStudent = await StudentModel.findById(id);

      // Foydalanuvchi admin, teacher yoki student bo'lmaganligini tekshiramiz
      if (!isAdmin && (isTeacher || isStudent)) {
        const findAdmin = await AdminModel.findOne();
        const isExists = await ChatsModel.findOne({
          members: [findAdmin._id, id],
        });

        if (!isExists) {
          const newChat = await ChatsModel.create({
            members: [findAdmin._id, id],
          });

          return res.send({
            status: 201,
            message: "Chat muvofaqqiyatli qo'shildi",
            success: true,
            data: newChat,
          });
        } else {
          return res.send({
            status: 200,
            message: "ok",
            success: true,
            data: isExists,
          });
        }
      } else {
        res.send({
          status: 403,
          message:
            "Foydalanuvchi admin, teacher yoki student bo'lishi shart emas",
          success: false,
        });
      }
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async GetChat(req, res) {
    try {
      const { token } = req.headers;
      const { id } = JWT.VERIFY(token);

      function findSingleObject(obj1, obj2, obj3) {
        const objects = [obj1, obj2, obj3];

        // Obyektlarni sanab quyidagi shart orqali tekshirish: faqat 1 obyekt, va u null emas
        const nonNullObjects = objects.filter(
          (obj) => obj !== null && typeof obj === "object"
        );

        // Agar faqatgina bir obyekt topilsa, u qaytariladi. Aks holda null.
        return nonNullObjects.length === 1 ? nonNullObjects[0] : null;
      }

      const conversations = await ChatsModel.find({
        members: { $in: [id] },
      }).sort({ createdAt: -1 });
      const conversationsUserData = Promise.all(
        conversations.map(async (conversation) => {
          const receiverId = conversation.members.find(
            (member) => member != id
          );
          const user = await UserModel.findById(receiverId);
          const admin = await AdminModel.findById(receiverId);
          const teacher = await WorkerModel.findById(receiverId);

          if (user) {
            return {
              user: {
                receiverId: user?._id,
                username: user?.username,
                img_path: user?.img_path,
                active: user?.active,
                active_id: user.active_id,
              },
              conversationId: conversation?._id,
            };
          }
          if (admin) {
            return {
              user: {
                receiverId: admin?._id,
                username: admin?.username,
                img_path: admin?.img_path,
                active: admin?.active,
                active_id: admin.active_id,
              },
              conversationId: conversation?._id,
            };
          }
          if (teacher) {
            return {
              user: {
                receiverId: teacher?._id,
                username: teacher?.username,
                img_path: teacher?.img_path,
                active: teacher?.active,
                active_id: teacher.active_id,
              },
              conversationId: conversation?._id,
            };
          }
        })
      );
      res.send({
        status: 200,
        message: "ok",
        success: true,
        data: await conversationsUserData,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }
}
