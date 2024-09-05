import { Router } from "express";
import multer from "multer";
import { DocsContr } from "../controllers/docs.js";
import adminCheck from '../middlewares/admin.js'

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


router.get('/', DocsContr.Get)
router.get('/industrial', DocsContr.GetIndustrial)
router.get('/presidental', DocsContr.GetPresidental)
router.post('/', upload.single('file'), adminCheck, DocsContr.Post)
router.put('/:id',  upload.single('file'), adminCheck, DocsContr.Put)
router.delete('/:id', adminCheck, DocsContr.Delete)






export default router;