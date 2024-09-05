import { Router } from "express";
import { ExtraDatasContr } from "../controllers/extra_datas.js";

const router = Router();

router.get("/", ExtraDatasContr.Get);
router.put("/", ExtraDatasContr.Put);

export default Router;
