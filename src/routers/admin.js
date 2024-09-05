import { Router } from "express";
import { AdminContr } from "../controllers/admin.js";
import AdminCheck from '../middlewares/admin.js'
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

router.post('/login', AdminContr.Login)
router.get('/my-profile', AdminCheck, AdminContr.GetMyProfile)
router.put('/edit-my-profile', AdminCheck, upload.single('file'), AdminContr.EditMyProfile);

export default router;