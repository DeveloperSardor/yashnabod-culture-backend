import { Router } from "express";
import { RolesContr } from "../controllers/roles.js";

const router = Router();

router.get('/', RolesContr.GetRoles);
router.post('/', RolesContr.AddRole);
router.put('/:id', RolesContr.EditRole);
router.delete('/:id', RolesContr.DeleteRole);


export default router;