import React, { Fragment } from "react";
import { withRouter, NextRouter } from "next/router";
import { LineConfig } from "konva/lib/shapes/Line";
import { io, Socket } from "socket.io-client";

import {
  CONN_HOST,
  DEFAULT_LINE,
  DrawEmits,
  DrawListens,
  DrawState,
  DrawTracker,
  LISTEN_EVENTS,
  Point,
  WhiteboardI,
  continueLine as continueLineOnBoard,
  addLine as addLineOnBoard,
} from "./data-types";
import styles from "./VirtualWhiteboard.module.css";
import { condContent, InputChange } from "../utils";
import Lobby from "./Lobby/Lobby";
import Whiteboard from "./Whiteboard/Whiteboard";
import Toolbar, { ERASER_SIZE, Tool } from "./Toolbar/Toolbar";
import { cloneDeep } from "lodash";

type DrawSocket = Socket<DrawListens, DrawEmits>;

interface Props {
  router: NextRouter;
}

export interface WhiteboardState {
  socket?: DrawSocket;
  whiteBoard?: WhiteboardI;
  drawTracker: DrawTracker;
  roomUsers: { name: string; id: string }[];
  tool?: Tool;
  myId?: string;
}

// So the actual export can be accessed by any name the importer wants to use for the default
// I'll keep it as the file name, but I want to export the class (before the router is injected)
// so I can access the types for fancy typing stuff
export class VirtualWhiteboardCLASS extends React.Component<
  Props,
  WhiteboardState
> {
  constructor(props: Props) {
    super(props);
    // I want to connect to the host as soon as I'm here so I can get info about rooms.
    this.state = {
      drawTracker: { me: { name: "me", drawing: false } },
      roomUsers: [],
      tool: (localStorage.getItem("virtual-wb-tool") as Tool) || "Black",
    };
  }

  // Destructuring syntax for accessing the query values was giving me the wrong types
  // They're always strings, and this lets me access them easily
  getQueryParams(
    router?: NextRouter
  ): [string | undefined, string | undefined] {
    const toAccess = router?.query || this.props.router.query;
    const user = toAccess.user as string | undefined;
    const room = toAccess.room as string | undefined;
    const ALIAS_KEY = "virtual-whiteboard-alias";
    // When a user successfully has  a name (navigates to a route with a user param). Remember that so it can pre-fill
    if (user) localStorage.setItem(ALIAS_KEY, user);

    // If the user is navigating to a room ID without a routerID, but with a local ID, put the local ID in the router
    const localAlias = localStorage.getItem(ALIAS_KEY);
    if (!user && localAlias) {
      console.log("Pushing local alias into query");
      (router || this.props.router).push({ query: { user: localAlias, room } });
    }
    return [
      user ? decodeURIComponent(user) : undefined,
      room ? decodeURIComponent(room) : undefined,
    ];
  }

  setDrawTracker(user: string, changes: Partial<DrawState>) {
    this.setState((prev) => ({
      drawTracker: {
        ...prev.drawTracker,
        [user]: { ...prev.drawTracker[user], ...changes },
      },
    }));
  }

  componentDidMount() {
    this.initializeSocket();
  }

  initializeSocket() {
    const [user, room] = this.getQueryParams();

    // redundant when called inside didUpdate, but important in didMount
    // makes sense to put it here so you can never initialize socket without these two
    if (!user || !room) return;
    const socket: DrawSocket = io(CONN_HOST);

    console.log("Starting up socket stuff");
    socket.on("take-users", (roomUsers, drawTracker) =>
      // I want the server's draw tracker info to be merged with my own.
      this.setState({
        roomUsers,
        drawTracker: {
          ...this.state.drawTracker,
          ...drawTracker,
        } as DrawTracker,
      })
    );
    socket.on("take-id", (id) => this.setState({ myId: id }));
    socket.on("take-line-start", this.startLine);
    socket.on("take-line-move", this.continueLine);
    socket.on("take-line-end", (id) => {
      this.setDrawTracker(id, { drawing: false });
    });

    socket.on("take-load-board", (whiteBoard) => {
      this.setState({ whiteBoard });
    });
    socket.on("take-name-change", this.changeBoardName);
    socket.on("take-clear", this.clearCanvas);
    socket.emit("join-room", room, user);

    this.setState({ socket });
  }

  killSocket() {
    this.state.socket?.disconnect();
    LISTEN_EVENTS.map((e) => this.state.socket?.off(e));
  }

  componentWillUnmount() {
    this.killSocket();
  }

  componentDidUpdate(prevProps: Props) {
    const [user, room] = this.getQueryParams();
    const [pastUser, pastRoom] = this.getQueryParams(prevProps.router);
    // Don't do anything if these haven't changed
    if (user === pastUser && room === pastRoom) return;
    // If I'm missing a current user or room, make sure I'm not connected
    if (!user || !room) return this.killSocket();
    // I know there is a current value for both of these
    // if they're different from their past values, I want to disconnect before I do anything else
    if (user !== pastUser || room !== pastRoom) this.killSocket();

    this.initializeSocket();
  }

  startLine = (
    { x, y }: Point,
    id: string,
    name: string,
    lineOptions: Partial<LineConfig> = {}
  ) => {
    const lineFig = { ...DEFAULT_LINE, ...lineOptions, points: [x, y] };

    if (this.state.tool === "Eraser") {
      lineFig.globalCompositeOperation = "destination-out";
      lineFig.width = ERASER_SIZE;
    } else {
      lineFig.fill = this.state.tool;
    }

    if (!this.state.whiteBoard) return;
    this.setState((prevState) => ({
      whiteBoard: prevState.whiteBoard
        ? addLineOnBoard(prevState.whiteBoard, lineFig)
        : prevState.whiteBoard,
    }));
    // Change the draw tracker AFTER adding the new line, so the index points to the right thing
    this.setDrawTracker(id, {
      name,
      drawing: true,
      index: this.state.whiteBoard?.lines.length - 1,
    });

    // If The line I'm starting is me, then emit to the room
    if (id === "me") this.state.socket?.emit("line-start", { x, y }, lineFig);
  };

  continueLine = ({ x, y }: Point, user: string) => {
    const tracker = this.state.drawTracker[user];
    const index = tracker.index;
    // If this source isn't drawing right now
    if (!tracker.drawing || typeof index === "undefined") return;

    this.setState((prevState) => ({
      whiteBoard: prevState.whiteBoard
        ? continueLineOnBoard(prevState.whiteBoard, { x, y }, index)
        : prevState.whiteBoard,
    }));

    // If I'm the source, emit to the room
    if (user === "me") this.state.socket?.emit("line-move", { x, y });
  };

  endLine = (user: string) => {
    this.setDrawTracker(user, { drawing: false });
    if (user === "me") this.state.socket?.emit("line-end");
  };

  changeBoardName = (name: string, emit = false) => {
    console.log("Setting new name to: " + name);
    this.setState((prev) => ({
      whiteBoard: prev.whiteBoard ? { ...prev.whiteBoard, name } : undefined,
    }));
    if (emit) this.state.socket?.emit("name-change", name);
  };

  // to ensure that everyone is in sync I will emit the request, then the server will commit that
  // clear unless someone is still drawing
  clearCanvas = (emit = false) => {
    this.setState((prev) => ({
      whiteBoard: prev.whiteBoard
        ? { ...prev.whiteBoard, lines: [] }
        : undefined,
      // removes all draw trackers, because this just kills all lines ever
      drawTracker: { me: { name: "me", drawing: false } },
    }));
    if (emit) this.state.socket?.emit("clear");
  };

  render() {
    // const drawTracker = drawTracker;
    const { roomUsers, whiteBoard, drawTracker, myId, tool } = this.state;
    const [user, room] = this.getQueryParams();

    return (
      <div className={styles["DrawWithFriends"]}>
        {!user || !room ? (
          <Lobby user={user} room={room}></Lobby>
        ) : !whiteBoard ? (
          "Loading..."
        ) : (
          <Fragment>
            <input
              className={styles["board-name"]}
              onChange={(e) => {
                if (e.target.value.length > 30)
                  e.target.value = e.target.value.slice(0, 30);
                this.changeBoardName(e.target.value, true);
              }}
              value={whiteBoard.name}
            />
            <div className={styles["body"]}>
              <Toolbar
                users={roomUsers}
                myId={myId || ""}
                tool={tool || "Black"}
                setTool={(t) => {
                  localStorage.setItem("virtual-wb-tool", t);
                  this.setState({ tool: t });
                }}
                clearCanvas={() => this.clearCanvas(true)}
              />
              <Whiteboard
                drawTracker={drawTracker}
                whiteBoard={whiteBoard}
                roomUsers={roomUsers}
                tool={tool}
                startLine={this.startLine}
                continueLine={this.continueLine}
                endLine={this.endLine}
              />
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withRouter(VirtualWhiteboardCLASS);

// Meium article that turned me on to konva
// https://medium.com/bb-tutorials-and-thoughts/how-to-implement-drawing-in-react-app-in-typescript-520cbba2c651
// Konva free-draw demo: ------------------ https://konvajs.org/docs/sandbox/Free_Drawing.html
// Konva docs: ---------------------------- https://konvajs.org/docs
// Totorial from WebDev Simplified -------- https://www.youtube.com/watch?v=iRaelG7v0OU
