import {Router } from 'express'
import { UsersContr } from '../controllers/users.js';
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

router.post(`/register`, UsersContr.Register);

router.post('/login', UsersContr.Login);


router.get('/', UsersContr.GetAllUsers);

router.get('/my-profile', UsersContr.GetMyProfile);

router.put('/edit-my-profile', upload.single('file'),UsersContr.EditMyProfile)


export default router;