import React from "react";
import { Layer, Line, Stage } from "react-konva";
import { WhiteboardPreview } from "../data-types";
import stageStyles from "../VirtualWhiteboard.module.css";
import lobbyStyles from "./Lobby.module.css";

interface Props {
  board: WhiteboardPreview;
  goToRoom: (x: string) => void;
}
export default function BoardPreview({ board, goToRoom }: Props) {
  const scale = Math.max(
    0.2,
    Math.min(1, (window.innerWidth - 50) / (5 * 800))
  );
  const height = 600; // Math.min(600, (width * 6) / 8);
  const width = 800; // Math.min(800, window.innerWidth - 50);
  const realHeight = height * scale;
  const realWidth = width * scale;
  return (
    <button
      className={lobbyStyles["preview-box"]}
      onClick={(e) => goToRoom(board._id)}
    >
      <h3 title={board._id}>{board.name}</h3>
      <div className={lobbyStyles["users"]}>Users: {board.userData.length}</div>
      <div
        style={{
          height: realHeight,
          width: realWidth,
          overflow: "hidden",
        }}
      >
        <Stage
          height={height}
          width={width}
          className={stageStyles["stage"]}
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            height,
            width,
          }}
        >
          <Layer>
            {board.lines.map((line, i) => (
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
    </button>
  );
}
