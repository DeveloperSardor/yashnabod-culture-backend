import AttendanceModel from "../schemas/attendance.js";
import { errorMessage } from "../data/datas.js";
import StudentsModel from '../schemas/student.js'

export class AttendanceContr {
  constructor() {}

  static async addAttendance(req, res) {
    try {
      const { date, group } = req.body;
  
      // Groupdan barcha talabalar olish
      const groupStudents = await StudentsModel.find({ group });
  
      // Barcha talabalarni present qilish
      const presentStudents = groupStudents.map((student) => ({
        student: student._id,
      }));
  
      // Yangi davomat obyektini yaratish va saqlash
      const newAttendance = new AttendanceModel({
        date,
        group,
        present: presentStudents,
      });
  
      await newAttendance.save();
  
      res.status(201).send({
        status : 201,
        message : "Davomat qo'shildi",
        success : true,
        data : newAttendance
      })
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async getAttendance(req, res) {
    try {
      const { group } = req.params;
      console.log(group);
      const attendances = await AttendanceModel.find({group}).populate({
        path: "group",
        populate: { path: "teacher" },
      }).populate('present.student').populate('absent.student').sort({ createdAt : -1 });
      res.send({
        status : 200,
        message : "Oylik davomat",
        success : true,
        data : attendances
      })
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }

  static async editAttendance(req, res) {
    try {
      const { attendanceId, userId } = req.body;
      const attendance = await AttendanceModel.findById(attendanceId);
  
      // Check if userId is in absent
      const userExistsInAbsent = attendance.absent.some((absentStudent) => absentStudent.student.toString() === userId);
  
      if (userExistsInAbsent) {
        // O'tkazish: userId absent ichidagi studentlarni
        attendance.absent = attendance.absent.filter((absentStudent) => absentStudent.student.toString() !== userId);
  
        // Qo'shish: userId ni presentga qo'shish
        const userExistsInPresent = attendance.present.some((presentStudent) => presentStudent.student.toString() === userId);
        if (!userExistsInPresent) {
          attendance.present.push({ student: userId });
        }
      } else {
        // O'tkazish: userId present ichidagi studentlarni
        attendance.present = attendance.present.filter((presentStudent) => presentStudent.student.toString() !== userId);
  
        // Qo'shish: userId ni absentga qo'shish
        const userExistsInAbsent = attendance.absent.some((absentStudent) => absentStudent.student.toString() === userId);
        if (!userExistsInAbsent) {
          attendance.absent.push({ student: userId });
        }
      }
  
      // Save the updated attendance record
      const updatedAttendance = await attendance.save();
  
      res.send({
        status: 200,
        message: "O'zgartirildi",
        success: true,
        data: updatedAttendance,
      });
    } catch (error) {
      res.send(errorMessage(error.message));
    }
  }



static async deleteAttendance(req, res){
    try {
        const { id } = req.params;
        const findAttendance = await AttendanceModel.findById(id);
        if(findAttendance == null){
            throw new Error(`Davomat topilmadi`)
        }
        const deleted = await AttendanceModel.findByIdAndDelete(id);
        res.send({
            status : 200,
            message : "Davomat muvofaqqiyatli o'chirildi",
            success : true,
            data : deleted
        })
    } catch (error) {
        res.send(errorMessage(error.message));
    }
}
}
