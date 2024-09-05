import { Router } from "express";
import { GroupCategories } from "../controllers/group_category.js";
import AdminCheck from '../middlewares/admin.js';


const router = Router();


router.get('/', GroupCategories.Get)
router.get('/:id', GroupCategories.Get)
router.post('/', AdminCheck,  GroupCategories.Post)
router.put('/:id', AdminCheck, GroupCategories.Put)
router.delete('/:id', AdminCheck, GroupCategories.Delete)


export default router;