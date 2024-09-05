import { Router } from 'express'
import { StudentContr } from '../controllers/student.js';
import adminCheck from '../middlewares/admin.js'
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

router.get('/statistic', StudentContr.statisticStudents)
router.get('/', StudentContr.getStudents)
router.get('/:id', StudentContr.getStudents)
router.post('/', adminCheck, upload.single('file'), StudentContr.addStudent)
router.put('/:id', adminCheck,upload.single('file'), StudentContr.editStudent)
router.delete('/:id', adminCheck, StudentContr.deleteStudent)

export default router;