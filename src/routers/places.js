import { Router } from "express";
import AdminCheck from '../middlewares/admin.js'
import { PlacesContr } from "../controllers/places.js";
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



router.get('/madaniy', PlacesContr.GetCulturalHeritages)     
router.get('/istirohat', PlacesContr.GetAmusementParks)
router.get('/:id', PlacesContr.GetAmusementParks)
router.post('/madaniy', upload.single('file'), PlacesContr.AddCulturalHeritages)
router.post('/istirohat', upload.single('file'), PlacesContr.AddAmusementParks)
router.put('/:id', upload.single('file'), PlacesContr.EditPlaces)
router.delete('/:id', PlacesContr.DeletePlaces)




export default router;