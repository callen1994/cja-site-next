import React, { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { condContent, httpProm } from "../../utils";
import { v4 as uniqueId } from "uuid";
import { CONN_HOST, WhiteboardPreview } from "../data-types";
import BoardPreview from "./BoardPreview";
import styles from "./Lobby.module.css";

interface Props {
  user: string | undefined;
  room: string | undefined;
}

export default function Lobby({ user, room }: Props) {
  // This is for testing purposes
  const [x, forceUpdate] = useState(0);

  const [newUser, setNewUser] = useState(user || "");
  const [error, setError] = useState("");
  const [boards, setBoards] = useState<WhiteboardPreview[]>([]);
  useEffect(() => {
    window.onresize = () => forceUpdate((x) => x + 1);
    httpProm(`${CONN_HOST}/get-whiteboards`).then((fetchedBoards) => {
      const parsed = JSON.parse(fetchedBoards);
      console.log(parsed);
      if (parsed) setBoards(parsed);
    });
  }, []);

  const router = useRouter();

  const goToRoom = (roomId: string) => {
    if (!newUser) return setError("missing-username");
    const room = encodeURIComponent(roomId);
    const user = encodeURIComponent(newUser);
    router.push({ query: { room, user } });
  };

  return (
    <div className={styles["Lobby"]}>
      <h1>Virtual Whiteboards</h1>
      <div className={`${styles["head"]} ${styles[error]}`}>
        <div className={styles["name-input"]}>
          <label htmlFor="name" className={styles["required"]}>
            {error ? "Please choose a name" : "Pick an Alias"}
          </label>
          <input
            id="name"
            value={newUser}
            className={styles["required"]}
            onChange={(e) => {
              setError("");
              setNewUser(e.target.value);
            }}
          />
        </div>
        <button
          className={styles["enter-room"]}
          onClick={() => goToRoom(uniqueId())}
        >
          Create New Board
        </button>
      </div>
      <h2>Edit an Existing Board</h2>
      <div className={styles["previews"]}>
        {boards.map((b, i) => (
          // <span key={i}>Test</span>
          <BoardPreview key={i} board={b} goToRoom={goToRoom}></BoardPreview>
        ))}
      </div>
    </div>
  );
}
