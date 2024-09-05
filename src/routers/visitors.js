import { Router } from "express";
import { VisitorsContr } from "../controllers/visitors.js";


const router = Router();

router.get('/', VisitorsContr.Get)
router.post('/', VisitorsContr.Post)


export default router;