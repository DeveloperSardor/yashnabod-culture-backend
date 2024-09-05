import GroupCategoryModel from '../schemas/group_category.js'
import GroupModel from '../schemas/groups.js'
import { errorMessage } from '../data/datas.js'


export class GroupCategories{
constructor(){}


static async Get(req, res){
    try {
        const { id } = req.params;
        if(id){
            const groups = await  GroupModel.find({category : id});

          res.send({
            status : 200,
            message : "Id orqali to'garak turining ma'lumotlari",
            success : true,
            data : groups
          })
        }else{
          res.send({
            status : 200,
            message : "Barcha to'garak turlari",
            success : true,
            data : await GroupCategoryModel.find()
          })
        }
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}


static async Post(req, res){
    try {
        const {name} = req.body;
        if(!name){
         throw new Error(`Ma'lumot yuborishingiz kerak`)
        }
        const addedCategory = await GroupCategoryModel.create({name});
        res.send({
            status : 201,
            message : "Muvofaqqiyatli qo'shildi",
            success : true,
            data : addedCategory
        })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}


static async Put(req, res){
    try {
        const { id } = req.params;
        const findById = await GroupCategoryModel.findById(id);
        if(findById == null){
            throw new Error(`To'garak turi topilmadi`)
        }
         const {name} = req.body;
        if(!name){
             throw new Error(`Ma'lumot yubormadingiz`) 
        }
        const editedCategory = await GroupCategoryModel.findByIdAndUpdate(id, {name}, {new : true})
        res.send({
            status : 200,
            message : "To'garak turi muvofaqqiyatli o'zgartirildi",
            success : true,
            data : editedCategory
        })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}


static async Delete(req, res){
    try {
        const { id } = req.params;
        const findById = await GroupCategoryModel.findById(id);
        if(findById == null){
            throw new Error(`To'garak turi topilmadi`)
        }
        const deletedCategory = await GroupCategoryModel.findByIdAndDelete(id);
        res.send({
            status : 200,
            message : "To'garak turi muvofaqqiyatli o'chirildi",
            success : true,
            data : deletedCategory
        })
    } catch (error) {
        res.send(errorMessage(error.message))
    }
}
}

