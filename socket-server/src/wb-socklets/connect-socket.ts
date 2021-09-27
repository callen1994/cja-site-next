import { Socket } from "socket.io";
import {
  DrawEmits,
  DrawListens,
} from "../../../components/VirtualWhiteboard/data-types";
import { WhiteboardService } from "./io-service";
import { fetchOrCreateBoard, saveBoard } from "./Whiteboard";

export function connectSocket(
  socket: Socket<DrawEmits, DrawListens>,
  wbService: WhiteboardService
) {
  socket.on("join-room", (roomId, name) => {
    // Send the user back their socket ID so they have a unique identifier
    socket.emit("take-id", socket.id);
    // When anyone joins, make sure I have their chosen username saved
    socket.data.name = name;
    // It looks like every socket default joins a room of 1 when they connect, so to specifically
    // indicate the virtual whiteboard room they're in, I'll use this field instead of sharing a field
    // with socket.io
    socket.data.roomId = roomId;
    socket.join(roomId);
    console.log(`Socket joined room id: ${socket.data.roomId}`);

    wbService
      .getBoard(roomId)
      .then((board) => socket.emit("take-load-board", board));

    wbService.emitUsersInRoom(roomId);

    // Alias I use becuase I write this a lot in the stuff below
    const toRoom = () => socket.broadcast.to(roomId);

    socket.on("line-start", ({ x, y }, lineFig) => {
      // takes care of all the stateful tracking with the line
      wbService.trackLineStart({ ...lineFig, points: [x, y] }, socket);
      toRoom().emit("take-line-start", { x, y }, socket.id, name, lineFig);
    });

    socket.on("line-move", ({ x, y }) => {
      wbService.trackLineMove({ x, y }, socket);
      toRoom().emit("take-line-move", { x, y }, socket.id, name);
    });

    socket.on("line-end", () => {
      console.log(`server line end in room ${roomId}`);
      wbService.trackLineEnd(socket);
      toRoom().emit("take-line-end", socket.id);
      // Commit the new line to the mongo save
      wbService.saveBoard(roomId);
    });

    socket.on("name-change", (newName) => {
      wbService.trackNameChange(roomId, newName);
      toRoom().emit("take-name-change", newName);
      wbService.saveBoard(roomId);
    });

    socket.on("clear", () => {
      wbService.clearRoom(roomId);
      toRoom().emit("take-clear");
      wbService.saveBoard(roomId);
    });
  });
}
