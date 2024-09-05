import { Router } from "express";
import { WorkersContr } from "../controllers/workers.js";
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

router.post('/login', WorkersContr.loginWorker)

router.get(`/best-teachers`, WorkersContr.GetThreeBestTeachers)
router.get('/', WorkersContr.getWorkers)
router.get('/:id', WorkersContr.getWorkers)
router.post('/', AdminCheck, upload.single('file'), WorkersContr.addWorker)
router.put('/', upload.single('file'), WorkersContr.editMyData)
router.put('/:id', AdminCheck, upload.single('file'), WorkersContr.editWorker)
router.delete('/:id', AdminCheck,  WorkersContr.deleteWorker)


export default router;
