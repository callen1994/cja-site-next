import { Schema, model } from "mongoose";
import { WhiteboardI } from "../../components/VirtualWhiteboard/data-types";

export default model<WhiteboardI>(
  "Whiteboard",
  new Schema<WhiteboardI>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    // The javascript value is Object, since the LineConfig is jut an interface
    lines: { type: [], required: true },
  })
);
