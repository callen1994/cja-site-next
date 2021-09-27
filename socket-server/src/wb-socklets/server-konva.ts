import Konva from "konva";
import { Request, Response } from "express";
import Whiteboard from "./Whiteboard";
import { data } from "../good-data-url";
import { createCanvas } from "canvas";
import {
  LineFig,
  WhiteboardI,
} from "../../../components/VirtualWhiteboard/data-types";

// I did some silly stuff like using "fill" and "width" properties
// this updates the config to use "stroke" for color and "strkeWidth" for
// size. Also I decided to remove tension and use bezier
export const updateLineFig = (l: LineFig) => {
  const fig: LineFig = {
    ...l,
    stroke: "#000",
    bezier: true,
    lineCap: "round",
    lineJoin: "round",
    strokeWidth: l.width,
  };

  delete fig.tension;
  delete fig.fill;
  delete fig.width;

  return fig;
};

// to handle the format change I'll enforce the new format when it's loaded
// and this will commit to the database when the board gets saved (this whole object gets saved)
export function updateWB(wb: WhiteboardI): WhiteboardI {
  const lines = wb.lines.map(updateLineFig);
  return { ...wb, lines };
}

function makeVirtualBoard(lines: LineFig[]) {
  const width = 800;
  const height = 600;

  // I use any to get around the constructor expecting an html canvas
  // if I don't pass a canvas id it actually just works fine (yay javascript)
  // I re-cast it so I keep my typing.
  const serverCanvas = createCanvas(width, height);
  const sampleStage: Konva.Stage = new (Konva.Stage as any)({
    width,
    height,
    // container: serverCanvas,
  });
  const layer = new Konva.Layer();
  sampleStage.add(layer);
  // makes more sense to use client side definition every where else and just force it through here
  lines.map((l) => layer.add(new Konva.Line(updateLineFig(l) as any)));
  return sampleStage;
}

function servTestData(testURL: string, res: Response) {
  res.send(`
    <style>body {background: #30353a; color: #FFF} img {background-color: #efefef;}</style>
    <script>
      console.log(\`${testURL}\`)
    </script>
    <div>
        <h1>Sending HTML</h1>
        <h2>Test Image?</h2>
        <img src='${testURL}' />
        <h2>Good Image?</h2>
        <img src='${data}' />
    </div>
  `);
}

async function konvaTest() {
  const testBoard = await Whiteboard.findById(
    "9b0f4fb8-a87d-4d94-8544-c2a3ae6135ef"
  );
  if (!testBoard) return "";
  // It's mad about import locations on which lineConfig I'm refering to
  return makeVirtualBoard(testBoard.lines).toDataURL();
}

export const serverKonvaTest = async (req: Request, res: Response) => {
  const konvaString = await konvaTest();
  servTestData(konvaString, res);
};
