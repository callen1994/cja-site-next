import React, { useEffect, useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { condContent } from "../utils";
import { KMouse, Point, WhiteboardI } from "./data-types";
import { ERASER_SIZE } from "./Toolbar/Toolbar";
import { VirtualWhiteboardCLASS, WhiteboardState } from "./VirtualWhiteboard";
import styles from "./VirtualWhiteboard.module.css";

interface Props extends WhiteboardState {
  startLine: (...args: Parameters<VirtualWhiteboardCLASS["startLine"]>) => void;
  continueLine: (
    ...args: Parameters<VirtualWhiteboardCLASS["continueLine"]>
  ) => void;
  endLine: (...args: Parameters<VirtualWhiteboardCLASS["endLine"]>) => void;
}

// This is a Class component because hooks weren't working for me.
// I was getting an error about mismatched version of React. My hunch is that it has something to do with the
// delayed load thing I'm doing in the pages which in turn has to do with Konva acting up,
// but using classes is totally working
//
// Or actually it was probably me being too clever and using the component as a function
// instead of using the JSX syntax...
export default function Whiteboard({
  whiteBoard,
  drawTracker,
  startLine,
  tool,
  continueLine,
  endLine,
}: Props) {
  const [mousePos, setMousePos] = useState<Point>({ x: 0, y: 0 });
  // A way to track when the mouse is in the field, so I don't get funky behavior when the mouse leaves
  const [mouseIn, setMouseIn] = useState(false);
  const [x, forceUpdate] = useState(0);
  const canvasCol = useRef<HTMLDivElement>(null);

  /* When I'm testing different screen sizes, this causes it to automatically update*/
  useEffect(
    () => window.addEventListener("resize", () => forceUpdate((x) => x + 1)),
    []
  );

  const mouseDn = (e: KMouse) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    startLine(pos, "me", "me");
  };

  const mouseMv = (e: KMouse) => {
    const pos = e.target.getStage()?.getPointerPosition();
    if (!pos) return;
    setMouseIn(true);
    setMousePos(pos);
    if (!drawTracker?.me.drawing) return;
    continueLine(pos, "me");
  };

  const mouseUp = (e: KMouse) => endLine("me");

  const mouseLeave = (e: KMouse) => {
    if (drawTracker?.me.drawing) endLine("me");
    setMouseIn(false);
  };

  const visibleCanvasHeight = () => {
    if (!canvasCol.current) return 600;
    const rect = canvasCol.current.getBoundingClientRect();
    return window.innerHeight - rect.top - 10;
  };

  const scale = Math.min(
    1,
    (window.innerWidth - 30) / 800,
    visibleCanvasHeight() / 600
  );
  const width = 800; // Math.min(800, window.innerWidth - 50);
  const height = 600; // Math.min(600, (width * 6) / 8);

  // mapped over each draw tracker to give an icon indicating another user drawing
  const makeUserIndicator = (id: string, i: number) => {
    const drawFig = drawTracker[id];
    const index = drawFig.index;
    if (
      !drawFig.drawing ||
      typeof index === "undefined" ||
      drawFig.name === "me"
    )
      return "";
    const line = (whiteBoard?.lines || [])[index];
    if (!line.points) return "";
    const lastPoints = line.points.slice(-2);
    return (
      <div
        key={i}
        className={styles["user-indicator"]}
        style={{ top: lastPoints[1] - 30, left: lastPoints[0] }}
      >
        {drawFig.name}
      </div>
    );
  };

  const eraserCursor = () => {
    if (tool !== "Eraser" || !mouseIn) return "";
    return (
      <div
        className={styles["eraser-cursor"]}
        style={{
          height: ERASER_SIZE,
          width: ERASER_SIZE,
          top: mousePos.y - ERASER_SIZE / 2,
          left: mousePos.x - ERASER_SIZE / 2,
        }}
      ></div>
    );
  };

  return whiteBoard ? (
    <div className={styles["canvas-col"]} ref={canvasCol}>
      <div
        className={styles["canvas-wrapper"]}
        style={{ height, width, transform: `scale(${scale})` }}
      >
        {eraserCursor()}
        {Object.keys(drawTracker).map(makeUserIndicator)}
        <Stage
          height={height}
          width={width}
          onMouseDown={mouseDn}
          onMousemove={mouseMv}
          onMouseup={mouseUp}
          onTouchStart={mouseDn}
          onTouchMove={(e) => {
            // Prevent the default action of scrolling on mobile
            e.evt.preventDefault();
            mouseMv(e);
          }}
          onTouchEnd={mouseUp}
          onMouseLeave={mouseLeave}
          className={styles["canvas-stage"]}
        >
          <Layer>
            {(whiteBoard?.lines || []).map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.fill}
                strokeWidth={line.width}
                tension={line.tension}
                lineCap="round"
                globalCompositeOperation={
                  line.globalCompositeOperation || "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  ) : (
    <div className={styles["loading"]}>Loading...</div>
  );
}
