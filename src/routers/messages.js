import { Router } from "express";
import { MessageContr } from "../controllers/messages.js";
import multer from "multer";


const router = Router();

const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, 'uploads/');
    },
    filename : function (req, file, cb){
        cb(null, file.originalname)
    }
});

const upload = multer({ storage : storage })


router.post('/', upload.single('file'), MessageContr.AddMessage);
router.get('/:chat', MessageContr.GetMyMessages);


export default router;