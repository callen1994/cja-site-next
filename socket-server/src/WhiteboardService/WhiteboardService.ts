import {
  DrawEmits,
  DrawListens,
  DrawTracker,
  LineFig,
  Point,
  WhiteboardI,
} from "../../../components/VirtualWhiteboard/data-types";

import { Server as Io, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import { onlyUnique } from "../utils";
import { connectSocket } from "./connect-socket";
import { fetchOrCreateBoard, saveBoard, updateWB } from "./Whiteboard";
import { cleanUpBoard } from "./cleanup-room";
import { doTests } from "./cleanup-tests";

export class WhiteboardService {
  constructor(httpServer: HTTPServer) {
    this.io = new Io<DrawEmits, DrawListens>(httpServer, {
      cors: { origin: "*" },
    });

    this.io.on("connection", (socket) => connectSocket(socket, this));
    // Saving with a lot of frequency shouldn't be necessary because I save after every finished line.
    // It also doesn't hurt to save frequently because the mongo server is on the same machine
    // Cleaning up realistically only needs to happen every once in a while.
    // I also cant rely on a disconnect even from the sockets because closing a window
    // doesn't run the cleanup events on the client side
    setInterval(() => this.saveAndDump(), 20000);
    // doTests();
  }

  // for each room keep track of the index of the line that a user is drawing (when they're drawing)
  private drawTracker: { [room: string]: Partial<DrawTracker> } = {};
  // I want the server to maintain a version of the room states so it can drop new users in with everything they need
  private rooms: { [roomId: string]: WhiteboardI } = {};
  private io: Io<DrawEmits, DrawListens>;

  trackLineStart(
    lineFig: LineFig,
    { data: { roomId, name }, id: socketId }: Socket
  ) {
    // ensure there's an object to write on
    this.drawTracker[roomId] = this.drawTracker[roomId] || {};
    // Just for good measure although I think this shouldn't be necessary...
    this.rooms[roomId].lines = this.rooms[roomId]?.lines || [];
    this.rooms[roomId].lines.push(lineFig);

    // the id of the line that this user is drawing (I'll reference it when this uer emits a move event)
    this.drawTracker[roomId][socketId] = {
      index: this.rooms[roomId].lines.length - 1,
      drawing: true,
      name: name,
    };
  }

  trackLineMove({ x, y }: Point, { data: { roomId }, id: socketId }: Socket) {
    const lineId = this.drawTracker[roomId][socketId]?.index;
    // update my local store (this will be transmitted to new users when the log in
    if (lineId || lineId === 0)
      this.rooms[roomId].lines[lineId].points?.push(x, y);
  }

  trackLineEnd({ data: { roomId }, id: socketId }: Socket) {
    // Doesn't really matter, but seems good to clean this up.
    delete this.drawTracker[roomId][socketId];
  }

  trackNameChange(roomId: string, name: string) {
    this.rooms[roomId].name = name;
  }

  saveBoard = (id: string) => saveBoard(this.rooms[id]);

  clearRoom(roomId: string) {
    this.rooms[roomId].lines = [];
    this.drawTracker[roomId] = {};
  }

  emitUsersInRoom(roomId: string) {
    // When a new user joins the room I want to emit a "take-users" event to everyone (including this person)
    // of the room members, so they can all simultaneously have an up-to-date users list.
    this.io.fetchSockets().then((sockets) =>
      this.io.in(roomId).emit(
        "take-users",
        sockets
          .filter((s) => s.rooms.has(roomId))
          .map((s) => ({ id: s.id, name: s.data.name })),
        // also emit the state of the draw tracker so new users know what's going on with that
        this.drawTracker[roomId] || {}
      )
    );
  }

  getBoard = async (roomId: string) => {
    const room = this.rooms[roomId];
    if (room) return room;
    const fetchedFromDB = await fetchOrCreateBoard(roomId);

    // to handle the format change I'll enforce the new format when it's loaded
    // and this will commit to the database when the board gets saved (this whole object gets saved)
    this.rooms[roomId] = updateWB(fetchedFromDB);
    return this.rooms[roomId];
  };

  // Returns info about the names of users and the rooms they're in
  getUserData = async () => (await this.io.fetchSockets()).map((s) => s.data);

  saveAndDump = async () => {
    const allSockets = await this.io.fetchSockets();
    const activeBoards = allSockets
      .map((s) => s.data.roomId)
      .filter(onlyUnique);
    // Cleanup empty rooms. (there's no leave room event, and I don't want the room and drawTracker lists to accumulate crud)
    const deadRooms = [
      ...Object.keys(this.rooms),
      ...Object.keys(this.drawTracker),
    ]
      .filter(onlyUnique)
      .filter((roomId) => !activeBoards.includes(roomId));

    // Active rooms are saved after every line is created, dead rooms are worth running one more save operation before saying goodbye
    // This is also where I'll get rid of everything that has been fully erased
    deadRooms.map((rId) => cleanUpBoard(this.rooms[rId]));
    deadRooms.map((roomId) => delete this.rooms[roomId]);
    deadRooms.map((roomId) => delete this.drawTracker[roomId]);
    // TODO kill boards older than a certain age... (but no less than 5?)
  };

  test(rId: string) {
    return cleanUpBoard(this.rooms[rId]);
  }
}

// Exporting this as a function so I know when it's being run
export function startUpWBSockets(httpServer: HTTPServer) {
  console.log("Spinning up Whiteboard Sockets");
  // I'm returning the server instance so the express app can deliver info from this through the HTTP
  // endpoints before a user connects to a room
  return new WhiteboardService(httpServer);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// NOTES:

// The term "emit" and "listen" will always make sense from the client side, and are opposite for the server
// e.g. The client emits a new line being drawn, the server responds to that emission and broadcasts a
// "take-line-start" event to all the other clients who are listening for a "take-line-start" event
