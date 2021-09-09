import React, { useState } from "react";
import CrewIcon from "../../Icons/CrewIcon";
import { condContent } from "../../utils";
import InviteOverlay from "../InviteOverlay/InviteOverlay";
import CancelIcon from "../../Icons/CancelIcon";
import styles from "./Toolbar.module.css";
import EraserIcon from "../../Icons/EraserIcon";

interface Props {
  users: { id: string; name: string }[];
  myId: string;
  tool: Tool;
  setTool: (t: Tool) => void;
  clearCanvas: () => void;
}

const COLORS_LU = {
  Black: "#000",
  Blue: "#00d",
  Green: "#0d0",
  Red: "#d00",
};

type Color = keyof typeof COLORS_LU;
export type Tool = Color | "Eraser";
export const ERASER_SIZE = 40;

const TOOLS: Tool[] = (Object.keys(COLORS_LU) as Tool[]).concat("Eraser");

export default function Toolbar({
  users,
  myId,
  tool,
  setTool,
  clearCanvas,
}: Props) {
  const [invite, toggleInvite] = useState(false);
  const drawTool = (t: Tool, i: number) => (
    <button
      className={styles["tool"] + (tool === t ? " " + styles["selected"] : "")}
      key={i}
      onClick={() => setTool(t)}
    >
      {t === "Eraser" ? (
        <EraserIcon />
      ) : (
        <div style={{ backgroundColor: COLORS_LU[t] }}></div>
      )}{" "}
      <span>{t}</span>
    </button>
  );

  const showUser = (u: { name: string; id: string }, i: number) => (
    <div className={styles["user-name"]} key={i}>
      {u.name}
      {u.id === myId ? " (me)" : ""}
    </div>
  );

  const inviteButton = (
    <button
      className={styles["invite"]}
      onClick={() => toggleInvite((i) => true)}
    >
      Invite
    </button>
  );

  return (
    <div className={styles["Toolbar"]}>
      <div>
        <div className={styles["tool-list"]}>
          {TOOLS.map(drawTool)}
          <button className={styles["tool"]} onClick={() => clearCanvas()}>
            <CancelIcon />
            <span>Clear</span>
          </button>
        </div>
      </div>
      <div className={styles["user-list"]}>
        <h3>Users In Room</h3>
        {users.map(showUser)}
        {inviteButton}
      </div>
      <div className={styles["user-list-little"]} tabIndex={-1}>
        <CrewIcon></CrewIcon>
        <div className={styles["user-count"]}>{users.length}</div>
        <div className={styles["full-list"]}>
          <h3>Users In Room:</h3>
          {users.map(showUser)}
          {inviteButton}
        </div>
      </div>
      {condContent(invite, <InviteOverlay />)}
    </div>
  );
}
