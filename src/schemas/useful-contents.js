import { model, Schema, Types } from "mongoose";

const UsefulContentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Required!"],
    },
    desc: {
      type: String,
      default: null,
    },
    file: {
      type: String,
      default : null
    },
    youtube_link: {
      type: String,
      default : null
    },
  },
  { timestamps: true }
);

export default model("UsefulContents", UsefulContentSchema);
