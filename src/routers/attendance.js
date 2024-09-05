import { Router } from "express";
import { AttendanceContr } from "../controllers/attendance.js";
import TeacherCheck from '../middlewares/teacher.js';

const router = Router();


router.post('/', TeacherCheck, AttendanceContr.addAttendance)

router.get('/:group', AttendanceContr.getAttendance)

router.put('/', TeacherCheck, AttendanceContr.editAttendance);

router.delete('/:id', TeacherCheck, AttendanceContr.deleteAttendance);


export default router;