import { Router } from "express";
import AdminCheck from "../middlewares/admin.js";
import { GroupsContr } from "../controllers/groups.js";
import multer from "multer";

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.get("/", GroupsContr.Get);
router.get("/:id", GroupsContr.Get);
router.post("/", AdminCheck, upload.single("file"), GroupsContr.Post);
router.put("/:id", AdminCheck, upload.single("file"), GroupsContr.Put);
router.delete("/:id", AdminCheck, GroupsContr.Delete);

export default router;
