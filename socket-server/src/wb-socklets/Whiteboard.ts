import { Schema, model } from "mongoose";
import { WhiteboardI } from "../../../components/VirtualWhiteboard/data-types";
import { nowString } from "../utils";

const Whiteboard = model<WhiteboardI>(
  "Whiteboard",
  new Schema<WhiteboardI>({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    // The javascript value is Object, since the LineConfig is jut an interface
    lines: { type: [], required: true },
    updatedAt: { type: String, required: true },
  })
);

export default Whiteboard;

export function saveBoard(wbData: WhiteboardI) {
  Whiteboard.findByIdAndUpdate(wbData._id, {
    ...wbData,
    updatedAt: nowString(),
  }).then(
    (suc) => `Successfully saved ${wbData._id}`,
    (err) => console.error(`Error saving ${wbData._id}`)
  );
}

// I'm exporting this guy so I can use it in my test function
export async function fetchOrCreateBoard(
  _id: string,
  defaultName: string = "New Whiteboard"
) {
  const found = await Whiteboard.findById(_id);
  return (
    found ||
    Whiteboard.create({
      _id,
      name: defaultName,
      lines: [],
      updatedAt: nowString(),
    })
  );
}
