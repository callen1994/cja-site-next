import express from "express";
import { createServer } from "http";
import { connect } from "mongoose";
import { MONGO_TEST_HTML } from "./mongTestHTML";
import { logError } from "./utils";
import Whiteboard from "./Whiteboard";
import { fetchOrCreateBoard, whiteboardSockets } from "./whiteboard-sockets";
import { Server as Io } from "socket.io";
import cors from "cors";

// Globals
const desiredRoot = "cja-site/socket-server";
const root = __dirname.slice(0, __dirname.indexOf(desiredRoot)) + desiredRoot;
const DATABASE_NAME = "whiteboard";
const PORT = 8001;

const app = express();
app.use(cors({ origin: "*" }));

const httpServer = createServer(app);

app.get("/", (req, res) => {
  console.log(root);
  res.sendFile("./public/test.html", { root });
});

// This is for me to track the status os mongo so if I get an error I can serve that immediately without
// running the test again (mostly there's no reason to wait for a 10s timeout if I know mongoose didn't connect)
let mongoErr = "";
let ioServer: Io;
app.get("/mongo-test", (req, res) => {
  const makePage = (message: string, data: string) =>
    res.send(
      MONGO_TEST_HTML.split("MESSAGE")
        .join(message)
        .split("TEST_DOCUMENT")
        .join(data)
    );

  if (mongoErr) return makePage("Mongo Server not Connected", mongoErr);

  fetchOrCreateBoard("test", "Test Whiteboard").then(
    (testDoc) => makePage("Mongo Is running", JSON.stringify(testDoc, null, 2)),
    (err) => makePage("Error fetching from MongoDB :/", err.toString())
  );
});

app.get("/get-whiteboards", async (req, res) => {
  console.log("Getting Whiteboards");
  //If there's an error, send that to the user
  if (mongoErr) return res.send("Mongo Error :/");
  if (!ioServer) return res.send("Error: Socket server not initiated...");
  // All the info about the boards
  const boards = await Whiteboard.find();
  // I want the info about active users on each board
  const sockets = await ioServer.fetchSockets();
  const body = boards.map((b) => ({
    ...b.toObject(),
    userData: sockets
      .filter((s) => s.data.whiteboardRoom === b.id)
      .map((s) => s.data),
  }));
  res.send(JSON.stringify(body));
});

connect(`mongodb://127.0.0.1:27017/${DATABASE_NAME}`, (err) => {
  // I think this only happens in development where mongo is started after an error was recorded.
  mongoErr = err?.message || "";
  if (err) return logError(err);
  // Don't startup the whiteboard stuff unless mong is actually g2g

  ioServer = whiteboardSockets(httpServer);
});

httpServer.listen(PORT);
