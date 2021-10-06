import Konva from "konva";
import {
  LineFig,
  WhiteboardI,
} from "../../../components/VirtualWhiteboard/data-types";
import { BIG_Log } from "../utils";
import { saveBoard, updateLineFig } from "./Whiteboard";

const isErase = (l: LineFig) =>
  l.globalCompositeOperation === "destination-out";
const isMark = (l: LineFig) => !isErase(l);

export function optomizeLines(lines: LineFig[], noisy = false): LineFig[] {
  const lineIsVisible = (line: LineFig, index: number, allLines: LineFig[]) => {
    // If it's an erase line, it's visible for these purposes
    if (isErase(line)) return true;
    const followingErases = allLines.slice(index).filter(isErase);
    // If the data url of this line and following erases is different from a blank canvas
    // then I know that the line is visible somehow

    const dataURL = linesToDataURL([line, ...followingErases]);
    if (noisy && line.stroke === "Green") {
      BIG_Log("testing visibility");
      console.log(line);
      console.log(followingErases);
      console.log(dataURL);
    }
    return dataURL !== BLANK_CANVAS;
  };
  // Test to see if there's anything under the erase line that is being covered
  // if not th erase line can be removed
  // I need to do this after filtering out the visible lines for it to work properly
  const lineIsUseful = (line: LineFig, index: number, allLines: LineFig[]) => {
    if (isMark(line)) return true;
    const precedingLines = allLines.slice(0, index);
    // It's useful if including the erase over the preceding lines makes a difference
    return (
      linesToDataURL(precedingLines) !==
      linesToDataURL(precedingLines.concat(line))
    );
  };

  return (
    lines
      // remove  any marks that have been totally erased
      .filter(lineIsVisible)
      // then remove any erase lines that aren't useful (when the think they erased is gone)
      .filter(lineIsUseful)
  );
}

// I wrote this to return a promise with the save status
// instead of returning a new board
// (because that's the behavior the outside world needs)
export function cleanUpBoard(board: WhiteboardI) {
  return saveBoard({ ...board, lines: optomizeLines(board.lines) });
}

export function linesToDataURL(lines: LineFig[]) {
  const width = 800;
  const height = 600;

  // I use any to get around the constructor expecting an html canvas
  // if I don't pass a canvas id it actually just works fine (yay javascript)
  // I re-cast it so I keep my typing.
  const sampleStage: Konva.Stage = new (Konva.Stage as any)({
    width,
    height,
  });
  const layer = new Konva.Layer();
  sampleStage.add(layer);
  // makes more sense to use client side definition
  // everywhere else and just force it through here
  lines.map((l) => layer.add(new Konva.Line(l as any)));
  return sampleStage.toCanvas().toDataURL();
}
export const BLANK_CANVAS = linesToDataURL([]);
