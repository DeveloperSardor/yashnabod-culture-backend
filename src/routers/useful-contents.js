import { Router } from "express";
import { UsefulContentContr } from "../controllers/useful-contents.js";
import AdminCheck from '../middlewares/admin.js'
import multer from 'multer';


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

router.get(`/`, UsefulContentContr.getContents);
router.get(`/:id`, UsefulContentContr.getContents);
router.post(`/`,  upload.single('file'),  UsefulContentContr.addContent);
router.put(`/:id`, upload.single('file'), UsefulContentContr.editContents);
router.delete(`/:id`, UsefulContentContr.deleteContent);

export default router;     