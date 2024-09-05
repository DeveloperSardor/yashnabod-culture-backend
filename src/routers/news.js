import { Router } from "express";
import { NewsContr } from "../controllers/news.js";
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

router.get('/', NewsContr.getNews);
router.get('/:id', NewsContr.getNews);
router.post('/', AdminCheck, upload.array('files'), NewsContr.addNews)
router.put('/:id', AdminCheck, upload.array('files'), NewsContr.editNews)
router.delete('/:id', AdminCheck, NewsContr.deleteNews)



export default router;