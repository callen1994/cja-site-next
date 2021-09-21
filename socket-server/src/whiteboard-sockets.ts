import { Server as Io, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
// Since these are interface imports I'm thinking they'll just be ignored in the compiled version
// so this cross-project import shouldn't be a problem in production
import {
  DrawListens,
  DrawEmits,
  WhiteboardI,
  DrawTracker,
} from "../../components/VirtualWhiteboard/data-types";
import { nowString, onlyUnique } from "./utils";
import Whiteboard from "./Whiteboard";

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

// Exporting this as a funciton so I know when it's being run
export function whiteboardSockets(httpServer: HTTPServer) {
  console.log("Spinning up Socket Io");
  // The term "emit" and "listen" will always make sense from the client side, and are opposite for the server
  // e.g. The client emits a new line being drawn, the server responds to that emission and broadcasts a
  // "take-line-start" event to all the other clients who are listening for a "take-line-start" event
  const io = new Io<DrawEmits, DrawListens>(httpServer, {
    cors: { origin: "*" },
  });

  // I want the server to maintain a version of the room states so it can drop new users in with everything they need
  const rooms: { [roomId: string]: WhiteboardI } = {};
  // for each room keep track of the index of the line that a user is drawing (when they're drawing)
  const drawTracker: { [room: string]: Partial<DrawTracker> } = {};

  async function saveActiveRooms_clearEmptyRooms() {
    const allSockets = await io.fetchSockets();
    console.log("Saving Boards:");
    const activeBoards = allSockets
      .map((s) => s.data.whiteboardRoom)
      .filter(onlyUnique);
    activeBoards.map(saveRoom);
    // Cleanup empty rooms. (there's no leave room event, and I don't want the room and drawTracker lists to accumulate crud)
    const deadRooms = [...Object.keys(rooms), ...Object.keys(drawTracker)]
      .filter(onlyUnique)
      .filter((roomId) => !activeBoards.includes(roomId));
    deadRooms.map((roomId) => delete rooms[roomId]);
    deadRooms.map((roomId) => delete drawTracker[roomId]);
    // TODO kill boards older than a certain age... (but no less than 5?)
  }

  // Saving with a lot of frequency shouldn't be necessary because I save after every finished line.
  // It also doesn't hurt to save frequently because the mongo server is on the same machine
  // Cleaning up realistically only needs to happen every once in a while.
  setInterval(saveActiveRooms_clearEmptyRooms, 20000);

  function saveRoom(_id: string) {
    Whiteboard.findByIdAndUpdate(_id, {
      ...rooms[_id],
      updatedAt: nowString(),
    }).then(
      (suc) => console.log(`Successfully saved ${_id}`),
      (err) => console.log(`Error saving ${_id}`)
    );
  }

  function emitUserList(roomId: string) {
    io.fetchSockets().then((sockets) =>
      io.in(roomId).emit(
        "take-users",
        sockets
          .filter((s) => s.rooms.has(roomId))
          .map((s) => ({ id: s.id, name: s.data.name })),
        drawTracker[roomId] || {}
      )
    );
  }

  function handleJoin(
    roomId: string,
    socket: Socket<DrawListens>,
    name: string
  ) {
    // When a new user joins the room I want to emit a "take-users" event to everyone (including this person)
    // of the room members, so they can all simultaneously have an up-to-date users list.
    emitUserList(roomId);

    // Send the user back their socket ID so they have a unique identifier
    socket.emit("take-id", socket.id);
    // When anyone joins, make sure I have their chosen username saved
    socket.data.name = name;
    // It looks like every socket default joins a room of 1 when they connect, so to specifically
    // indicate the virtual whiteboard room they're in, I'll use this field instead of sharing a field
    // with socket.io
    socket.data.whiteboardRoom = roomId;
    socket.join(roomId);
    console.log(`Socket joined room id: ${socket.data.whiteboardRoom}`);

    // If the data for this room exists, sent it to the joining user synchronously
    if (rooms[roomId]) return socket.emit("take-load-board", rooms[roomId]);
    // If the room isn't loaded locally I need to pull the info from Mongo
    fetchOrCreateBoard(roomId).then((room) => {
      rooms[roomId] = room;
      socket.emit("take-load-board", rooms[roomId]);
    });
    // When someone draws, ensure that I have a draw tracker object for this room
    // helps avoid crashes
    drawTracker[roomId] = drawTracker[roomId] || {};
  }

  io.on("connection", (socket) => {
    socket.on("join-room", (roomId, name) => {
      // Make sure the room data is loaded locally and the joining user gets that info
      handleJoin(roomId, socket, name);

      const toRoom = () => socket.broadcast.to(roomId);

      socket.on("line-start", ({ x, y }, lineFig) => {
        // When someone draws, ensure that I have a draw tracker object for this room
        drawTracker[roomId] = drawTracker[roomId] || {};
        console.log("server line start");
        // add the line to my local store of the dat
        rooms[roomId].lines.push({ ...lineFig, points: [x, y] });
        // the id of the line that this user is drawing (I'll reference it when this uer emits a move event)
        drawTracker[roomId][socket.id] = {
          index: rooms[roomId].lines.length - 1,
          drawing: true,
          name,
        };

        toRoom().emit("take-line-start", { x, y }, socket.id, name, lineFig);
      });

      socket.on("line-move", ({ x, y }) => {
        const lineId = drawTracker[roomId][socket.id]?.index;
        // update my local store (this will be transmitted to new users when the log in
        if (lineId || lineId === 0)
          rooms[roomId].lines[lineId].points?.push(x, y);
        toRoom().emit("take-line-move", { x, y }, socket.id, name);
      });

      socket.on("line-end", () => {
        console.log(`server line end in room ${roomId}`);
        rooms[roomId].lines.map((l) => console.log(l));
        // Doesn't really matter, but seems good to clean this up.
        delete drawTracker[roomId][socket.id];
        toRoom().emit("take-line-end", socket.id);
        // Commit the new line to the mongo save
        saveRoom(roomId);
      });

      socket.on("name-change", (newName) => {
        rooms[roomId].name = newName;
        toRoom().emit("take-name-change", newName);
        saveRoom(roomId);
      });

      socket.on("clear", () => {
        rooms[roomId].lines = [];
        drawTracker[roomId] = {};
        toRoom().emit("take-clear");
        saveRoom(roomId);
      });
    });
  });

  // I'm returning the server instance so the express app can deliver info from this through the HTTP
  // endpoints before a user connects to a room
  return io;
}
