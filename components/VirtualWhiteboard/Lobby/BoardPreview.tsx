import React, { useEffect, useRef, useState } from "react";
import { Layer, Line, Stage } from "react-konva";
import { getContentWidth } from "../../Utilities/utils";
import { WhiteboardPreview } from "../data-types";
import stageStyles from "../Whiteboard/Whiteboard.module.css";
import lobbyStyles from "./Lobby.module.css";

interface Props {
  board: WhiteboardPreview;
  goToRoom: (x: string) => void;
}
export default function BoardPreview({ board, goToRoom }: Props) {
  const containerRef = useRef<HTMLButtonElement>(null);
  const [boardSizing, setBoardSizing] = useState({
    height: 0,
    width: 0,
    scale: 0,
  });
  const baseHeight = 600;
  const baseWidth = 800;
  // The board size is figured out based on the width of the containing button
  // so I can style the button normally
  useEffect(() => {
    const contentWidth = getContentWidth(containerRef.current) || 0;
    // only get as big as 100% of original size
    const scale = Math.min(1, contentWidth / baseWidth);

    const height = baseHeight * scale;
    const width = baseWidth * scale;
    setBoardSizing({ scale, height, width });
  }, [containerRef]);

  return (
    <button
      ref={containerRef}
      className={lobbyStyles["preview-box"]}
      onClick={(e) => goToRoom(board._id)}
    >
      <h3 title={board._id}>{board.name}</h3>
      <div className={lobbyStyles["users"]}>
        Active Users: {board.userData.length}
      </div>
      <div
        style={{
          height: boardSizing.height,
          width: boardSizing.width,
          overflow: "hidden",
        }}
      >
        <Stage
          height={baseHeight}
          width={baseWidth}
          className={stageStyles["preview-stage"]}
          style={{
            transform: `scale(${boardSizing.scale})`,
            transformOrigin: "top left",
            height: baseHeight,
            width: baseWidth,
          }}
        >
          <Layer>
            {board.lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                bezier={true}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation={
                  line.globalCompositeOperation || "source-over"
                }
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </button>
  );
}
