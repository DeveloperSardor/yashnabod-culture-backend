import { Router } from "express";
import TeacherCheck from '../middlewares/teacher.js';
import AdminCheck from '../middlewares/admin.js'
import { ThemesContr } from "../controllers/themes.js";

const router = Router();


router.get('/:group', ThemesContr.GetThemes)
router.post('/', ThemesContr.AddTheme)
router.delete('/:id', ThemesContr.DeleteTheme)



export default router;