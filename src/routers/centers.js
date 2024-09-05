import { Router } from "express";
import { CentersContr } from "../controllers/centers.js";
import JWT from '../utils/jwt.js'
import multer from "multer";
import AdminCheck from '../middlewares/admin.js'


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


router.get('/', CentersContr.GetCenters)
router.get('/:id', CentersContr.GetCenters)
router.post('/', AdminCheck, upload.single('file'), CentersContr.AddCenter)
router.put('/:id', AdminCheck,upload.single('file'),  CentersContr.EditCenter)
router.delete('/:id', AdminCheck, CentersContr.DeleteCenter)

export default router;