import { model, Schema, Types } from "mongoose";
import { daysOfWeek } from "../data/datas.js";

const GroupSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name of group is required field!"],
    },
    img: {
      type: String,
      required: [true, "Image of group is required field!"],
    },
    category: {
      type: Types.ObjectId,
      ref: "GroupCategories",
    },
    center: {
      type: Types.ObjectId,
      ref: "Centers",
    },
    days: [
      {
        type: String,
        // enum : daysOfWeek
      },
    ],
    price: {
      type: Number,
    },
    time: {
      type: String,
    },
    teacher: {
      type: Types.ObjectId,
      ref: "Workers",
    },
  },
  { timestamps: true }
);

export default model("Groups", GroupSchema);