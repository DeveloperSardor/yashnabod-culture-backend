import MessagesModel from '../schemas/messages.js';
import JWT from '../utils/jwt.js';
import ChatModel from '../schemas/chats.js'
import UserModel from '../schemas/users.js'
import AdminModel from '../schemas/admin.js'
import TeacherModel from '../schemas/workers.js'
import { errorMessage } from '../data/datas.js';
 

export class MessageContr{


static async AddMessage(req, res){
    try {
        const {token} = req.headers;
        const {id} = JWT.VERIFY(token);
        const file = req.file;
        const {chat, message, receiver} = req.body;
        if(!chat && receiver){
            const newConversation = await ChatModel.create({members : [id, receiver]});
            const newMessage = await MessagesModel.create({chat : (await newConversation)._id, sender, message, type_file : file?.mimetype.split('/')[0], link_file : file?.destination + file?.originalname});
            return res.send({
                status : 201,
                message : "ok",
                success : true,
                data : newMessage
            })
        }
        const newMessage = await MessagesModel.create({chat, sender : id, message, type_file : file?.mimetype.split('/')[0], link_file : file?.destination + file?.originalname});
        res.send({
            status : 201,
            message : "Xabar qo'shildi",
            success : true,
            data : newMessage
        })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}


static async GetMyMessages(req, res){
    try {
        const { chat } = req.params;
        if(!chat){
            throw new Error(`Conversation Id is required!`)
        }
        const messages = await MessagesModel.find({chat});
        const messageUserData = Promise.all(messages.map(async (message)=>{
            const user = await UserModel.findById(message.sender)
            const admin = await AdminModel.findById(message.sender)
            const teacher = await TeacherModel.findById(message.sender)
            if(user){
                return {user : {_id : user._id, img_path : user.img_path, username : user.username, email : user.email, info : user.info, active : user.active, active_id : user.active_id}, message : message.message}
            }
            if(admin){
                return {user : {_id : admin._id, img_path : admin.img_path, username : admin.username, email : admin.email, info : admin.info, active : admin.active, active_id : admin.active_id}, message : message?.message}
            }
            if(teacher){
                return {user : {_id : teacher._id, img_path : teacher.img_path, username : teacher.username, email : teacher.email, info : teacher.info, active : teacher.active, active_id : teacher.active_id}, message : message?.message}
            }
        }))
        res.send({
            status : 200,
            message : "ok",
            success : true,
            data : await messageUserData
    })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}



}