import express from "express";
import { createServer } from "http";
import { connect } from "mongoose";
import { mongoTest, MONGO_TEST_HTML } from "./mong-test";
import { logError, apiTest } from "./utils";
import Whiteboard from "./wb-socklets/Whiteboard";
import cors from "cors";
import { serverKonvaTest, updateWB } from "./wb-socklets/server-konva";
import { startUpWBSockets, WhiteboardService } from "./wb-socklets/io-service";

const DATABASE_NAME = "whiteboard";
const PORT = 8001;

const app = express();
app.use(cors({ origin: "*" }));

const httpServer = createServer(app);

app.get("/", apiTest);

// This is for me to track the status os mongo so if I get an error I can serve that immediately without
// running the test again (mostly there's no reason to wait for a 10s timeout if I know mongoose didn't connect)
let mongoErr = "";
let wbServer: WhiteboardService;

app.get("/mongo-test", (req, res) => mongoTest(res, mongoErr));

app.get("/server-konva-test", serverKonvaTest);

app.get("/get-whiteboards", async (req, res) => {
  console.log("Getting Whiteboards");
  //If there's an error, send that to the user
  if (mongoErr) return res.send("Mongo Error :/");
  if (!wbServer) return res.send("Error: Socket server not initiated...");
  // All the info about the boards
  const boards = await Whiteboard.find();
  // I want the info about active users on each board
  const userData = await wbServer.getUserData();
  const body = boards.map((b) => ({
    ...updateWB(b.toObject()),
    userData: userData.filter((u) => u.whiteboardRoom === b.id),
  }));
  res.send(JSON.stringify(body));
});

connect(`mongodb://127.0.0.1:27017/${DATABASE_NAME}`, (err) => {
  // I think this only happens in development where mongo is started after an error was recorded.
  mongoErr = err?.message || "";
  if (err) return logError(err);
  // Don't startup the whiteboard stuff unless mong is actually g2g

  wbServer = startUpWBSockets(httpServer);
});

httpServer.listen(PORT);
