import { Schema, model } from "mongoose";
import {
  LineFig,
  WhiteboardI,
} from "../../../components/VirtualWhiteboard/data-types";
import { nowString } from "../utils";
import { Document } from "mongoose";

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

export function saveBoard(wbData: WhiteboardI): Promise<any> {
  return Whiteboard.findByIdAndUpdate(wbData._id, {
    ...wbData,
    updatedAt: nowString(),
  }).then(
    (suc) => {
      const msg = `Successfully saved ${wbData._id}`;
      console.log(msg);
      return msg;
    },
    (err) => {
      console.error(`Error saving ${wbData._id}`);
      return err;
    }
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

// Alias for the Mongoose type
export type WbDocument = Document<any, any, WhiteboardI> & WhiteboardI;

// I did some silly stuff like using "fill" and "width" properties
// this updates the config to use "stroke" for color and "strkeWidth" for
// size. Also I decided to remove tension and use bezier
export const updateLineFig = (l: LineFig) => {
  const fig: LineFig = {
    ...l,
    bezier: true,
    lineCap: "round",
    lineJoin: "round",
    stroke: l.stroke || l.fill || "#000",
    strokeWidth: l.strokeWidth || l.width,
  };

  delete fig.tension;
  delete fig.fill;
  delete fig.width;

  return fig;
};

// to handle the format change I'll enforce the new format when it's loaded
// and this will commit to the database when the board gets saved (this whole object gets saved)
// Even Though the mongoose document can me read as a WhiteBoardI shaped object
// destructuring it doesn't yield a whiteboardI shaped object (not even close!)
export function updateWB(wbDoc: WbDocument): WhiteboardI {
  const wb = wbDoc.toObject();
  const lines = wb.lines.map(updateLineFig);
  return { ...wb, lines };
}
