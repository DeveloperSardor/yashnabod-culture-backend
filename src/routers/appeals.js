import { Router } from "express";
import { AppealContr } from "../controllers/appeals.js";


const router = Router();




router.post('/send', AppealContr.sendAppeal );
router.get('/', AppealContr.GetAllApealAsAdmin);
router.delete('/:id', AppealContr.DeleteAppealAsAdmin);
router.post('/add-to-students/:id', AppealContr.AppealToStudents);



export default router;