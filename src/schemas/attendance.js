import { model, Schema, Types } from "mongoose";

const AttendanceSchema = new Schema(
  {
    date : {
      type : String
    },
    day : {
      type : String
    },
    group: {
      type: Types.ObjectId,
      ref: "Groups",
    },
    absent: [
      {
        student: {
          type: Types.ObjectId,
          ref: "Students",
        }
      },
    ],
    present: [
      {
        student: {
          type: Types.ObjectId,
          ref: "Students",
        }
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model("Attendances", AttendanceSchema);
