import express from "express";
import { createServer } from "http";
import { connect } from "mongoose";
import { mongoTest } from "./mong-test";
import { logError, apiTest, BIG_Log } from "./utils";
import Whiteboard, { updateWB } from "./WhiteboardService/Whiteboard";
import cors from "cors";
import {
  startUpWBSockets,
  WhiteboardService,
} from "./WhiteboardService/WhiteboardService";
import { linesToDataURL } from "./WhiteboardService/cleanup-room";
import { case1 } from "./WhiteboardService/cleanup-tests";

const DATABASE_NAME = "whiteboard";
const PORT = 8001;

const app = express();
app.use(cors({ origin: "*" }));
// adds ta body parser so is actually reads the request body
app.use(express.text({ type: "text/plain" }));
const httpServer = createServer(app);

app.get("/", apiTest);

// This is for me to track the status os mongo so if I get an error I can serve that immediately without
// running the test again (mostly there's no reason to wait for a 10s timeout if I know mongoose didn't connect)
let mongoErr = "";
let wbServer: WhiteboardService;

app.get("/mongo-test", (req, res) => mongoTest(res, mongoErr));
app.get("/show-me", (req, res) => {
  const sample = linesToDataURL(case1);
  res.send(
    `<style> img {border: 5px solid #000; margin: 20px;} </style> <div><img src=${sample} /></div>`
  );
});
app.post("/wb-test", (req, res) => {
  BIG_Log("Request Body");
  console.log(req.body);
  wbServer.test(JSON.parse(req.body).room).then((suc) => res.send(suc));
});

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
    ...updateWB(b),
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
