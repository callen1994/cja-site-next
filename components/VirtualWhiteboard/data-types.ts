import { KonvaEventObject } from "konva/lib/Node";
import { LineConfig } from "konva/lib/shapes/Line";
export type KMouse =
  | KonvaEventObject<MouseEvent>
  | KonvaEventObject<TouchEvent>;

export interface Point {
  x: number;
  y: number;
}

// Very explicit and readable way to explain what I'm tracking and what it means
export interface DrawState {
  drawing: boolean;
  name: string;
  index?: number;
}
export interface DrawTracker {
  me: DrawState;
  [userId: string]: DrawState;
}

export const CONN_HOST =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8001"
    : "https://sockets.connorjamesallen.com";

export interface DrawEmits {
  "join-room": (room: string, user: string) => void;
  "line-start": (point: Point, lineFig: LineConfig, user?: string) => void;
  "line-move": (point: Point, user?: string) => void;
  "line-end": (user?: string) => void;
  "name-change": (newName: string) => void;
  clear: () => void;
}

// Since sockets have unique ID's those are safer/easier to use than user-generated names
export interface DrawListens {
  connection: () => void;
  "take-line-start": (
    point: Point,
    id: string,
    name: string,
    lineFig: LineConfig
  ) => void;
  "take-line-move": (point: Point, id: string, name: string) => void;
  "take-line-end": (id: string) => void;
  // For when a user joins a room, they get to know their own id
  "take-id": (id: string) => void;

  // If someone joins while someone else is mid-line, I want to let the new user drop right in with all the info they need,
  // so the drawTracker state needs to be emitted too (the server has it's own).
  "take-users": (
    names: { name: string; id: string }[],
    drawTracker: Partial<DrawTracker>
  ) => void;
  "take-load-board": (board: WhiteboardI) => void;
  "take-name-change": (newName: string) => void;
  "take-clear": () => void;
}

export const LISTEN_EVENTS: (keyof DrawListens)[] = [
  "take-line-start",
  "take-line-move",
  "take-line-end",
  "take-id",
  "take-users",
  "take-load-board",
  "take-name-change",
];

export interface WhiteboardI {
  _id: string;
  name: string;
  lines: LineConfig[];
}

export interface WhiteboardPreview extends WhiteboardI {
  // I'll be receiving the .data property on each uer which is not strongly typed
  // but these are thing things I'm currently setting on that
  userData: { name: string; whiteboardRoom: string }[];
}

export const DEFAULT_LINE: LineConfig = {
  fill: "#000",
  width: 8,
  tension: 0.5,
  globalCompositeOperation: "source-over",
};

export const addLine = (
  board: WhiteboardI,
  newLine: LineConfig
): WhiteboardI => {
  board.lines.push(newLine);
  return board;
};

export const continueLine = (
  board: WhiteboardI,
  { x, y }: Point,
  index: number
): WhiteboardI => {
  board.lines[index] = {
    ...board.lines[index],
    points: board.lines[index].points?.concat([x, y]),
  };
  return board;
};
