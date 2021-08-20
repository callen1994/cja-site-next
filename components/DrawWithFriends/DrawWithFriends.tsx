import { fabric } from "fabric";
import { cloneDeep, last } from "lodash";
import React, { MouseEventHandler, useCallback, useRef, useState } from "react";
import styles from "./DrawWithFriends.module.css";

type Div = HTMLDivElement;
type OnMouse<T> = MouseEventHandler<T>;

interface BrushPoint {
  x: number;
  y: number;
}

////////////////////////////////////////////////////////////
// It's looking like the way to update the reciever is with a fabric
// colleciton and then inserting the new path into the collection with insert at
// http://fabricjs.com/docs/fabric.Collection.html#.insertAt
// I tried just modifying the _objects list directly, but fabric wasn't re-rendering those changes
// I could also try forcing a re-render, but that sounds dumb...
////////////////////////////////////////////////////////////

interface Props {}

function startUpFabricCanvas(
  container: HTMLDivElement,
  target: React.MutableRefObject<fabric.Canvas | undefined>,
  uniqueId: string
) {
  // Clear the container in the case that it already exists. This happens when in dev
  // mode and it's re-rendering off a file change
  container.innerHTML = "";
  const newCanvas = document.createElement("canvas");
  newCanvas.id = uniqueId;
  newCanvas.width = window.innerWidth / 2;
  newCanvas.height = window.innerHeight / 2;
  container.appendChild(newCanvas);
  target.current = new fabric.Canvas(uniqueId, { isDrawingMode: true });
}

function makeFabricPathString(brushPoints: BrushPoint[]) {
  const ret = brushPoints.map((p, i) => [
    // If it's the start, this is M, the end is L and the middle is Q
    i === 0 ? "M" : i === brushPoints.length - 1 ? "L" : "Q",
    p.x,
    p.y,
  ]);

  return ret;
}

export default function DrawWithFriends() {
  const [count, setCount] = useState(0);

  // Use callback is only called on the first component render cycle
  // Make this a ref so the reference persists through render cycles
  const fabRef = useRef<fabric.Canvas>();
  const otherFabRef = useRef<fabric.Canvas>();
  const startupMainFabric = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;
    startUpFabricCanvas(container, fabRef, "canvas-main");
    if (!fabRef.current) return;
    fabRef.current.freeDrawingBrush.color = "blue";
    fabRef.current.freeDrawingBrush.width = 10;
  }, []);

  const startupOtherFabric = useCallback((container: HTMLDivElement | null) => {
    if (!container) return;
    startUpFabricCanvas(container, otherFabRef, "canvas-other");
    if (!otherFabRef.current) return;
    otherFabRef.current.freeDrawingBrush.color = "red";
    otherFabRef.current.freeDrawingBrush.width = 10;
  }, []);

  const test = () => {
    if (!fabRef.current) return;
    console.log("%cFabric Canvas:\n\n", "color: yellow");
    console.log(fabRef.current);
  };

  const mainMouseMove: OnMouse<Div> = (e) => {
    if (!fabRef.current) return;
    // if (!fabRef.current._objects[0]) return console.log("No Objects");
    const freeDrawPath = (fabRef.current.freeDrawingBrush as any)[
      "_points"
    ] as BrushPoint[];
    if (otherFabRef.current && otherFabRef.current._objects[0])
      otherFabRef.current._objects[0] = new fabric.Path(
        makeFabricPathString(freeDrawPath) as any
      );
  };

  const mainMouseDown: OnMouse<Div> = (e) => {
    if (!fabRef.current) return;
    console.log(`%c\n\n\nMOUSE DOWN\n\n\n`, "color: orange");
    // Fabric doesn't give me access to this through it's type system, but I want it so I can
    // do continuously synchronized drawing. So I'mmnaually typing this.
    const freeDrawPath = (fabRef.current.freeDrawingBrush as any)[
      "_points"
    ] as BrushPoint[];

    const parsedPath = makeFabricPathString(freeDrawPath); // freeDrawPath.map((p) => new fabric.Point(p.x, p.y));
    console.log(parsedPath);
    // turn freedraw path into the Point[] that .Path accepts
    const copy = new fabric.Path(parsedPath as any);
    copy.stroke = fabRef.current?.freeDrawingBrush.color;
    copy.strokeWidth = fabRef.current?.freeDrawingBrush.width;
    copy.strokeLineCap = "round";
    otherFabRef.current?.add(copy);
  };

  const mainMouseUp: OnMouse<Div> = () => {
    if (!fabRef.current) return;
    console.log(`%c\n\n\nMOUSE UP\n\n\n`, "color: orange");
    // Need to set timeout so this happens after fabric adds the object
    setTimeout(() => {
      const justDrew = last(fabRef.current?._objects) as fabric.Path;

      // if (!justDrew) return;
      console.log(justDrew);
      console.log(otherFabRef.current?._objects[0]);
      // const copy = new fabric.Path(justDrew.path);
      // copy.stroke = fabRef.current?.freeDrawingBrush.color;
      // copy.strokeWidth = fabRef.current?.freeDrawingBrush.width;
      // copy.fill = "#fff0";
      // otherFabRef.current?.add(copy);
    }, 0);
  };

  return (
    <div className={styles["DrawWithFriends"]}>
      <h1>Fabric Js Test</h1>
      <div className="button-row">
        <button onClick={test}>Test</button>
        <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>
      </div>

      <div
        className={styles["fabric-wrapper"]}
        ref={startupMainFabric}
        onMouseMove={mainMouseMove}
        onMouseDown={mainMouseDown}
        onMouseUp={mainMouseUp}
      ></div>
      <div className={styles["fabric-wrapper"]} ref={startupOtherFabric}></div>
    </div>
  );
}
