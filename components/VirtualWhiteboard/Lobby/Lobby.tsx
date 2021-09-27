import React, { ChangeEventHandler, Fragment, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { condContent, httpProm } from "../../Utilities/utils";
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
  const [foundBoard, setFoundBoard] = useState<WhiteboardPreview>();
  const [boards, setBoards] = useState<WhiteboardPreview[]>([]);
  
  useEffect(() => {
    window.onresize = () => forceUpdate((x) => x + 1);
    httpProm(`${CONN_HOST}/get-whiteboards`).then((fetchedBoards) => {
      const parsed = JSON.parse(fetchedBoards);
      console.log(parsed);
      if (parsed) setBoards(parsed);
    });
  }, []);

  // When I get a room in the props (use has a room in the query)
  //   and I've loaded the boards from the http call
  //   then I want to set my found board value which will cause a new render
  const setQueryBoard = () => {
    // make sure both of these exist
    if (room && boards) setFoundBoard(boards.find(b => b._id === room));
    // remove it when I navigate away
    else setFoundBoard(undefined);
  }
  useEffect(setQueryBoard, [room, boards])

  // Had some weirdness with the displayed user value not syncing with the router
  // this should keep them in sync
  useEffect(() => setNewUser(user || ''), [user])

  const takeUserChange:ChangeEventHandler<HTMLInputElement> = (e) => {
    setError("");
    const enteredUser = e.target.value || '';
    // When a user changes their name, save it locally
    localStorage.setItem("virtual-whiteboard-alias", enteredUser) 
    setNewUser(enteredUser);
  }

  const nameSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log('submit fired')
    if (newUser) {
      const pushing = {query: { ...router.query, user: newUser }};
      console.log(pushing)
      router.push(pushing);}
  }

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
          <form onSubmit={nameSubmit}>
          <input
            id="name"
            value={newUser}
            className={styles["required"]}
            onChange={takeUserChange}
            />
            </form>
        </div>
        {foundBoard ?
        <button
        className={styles["see-all"] + ' btn-clr'}
        onClick={() => router.push({query:{}})}
      >
        See All Boards
      </button> : <button
          className={styles["enter-room"] + ' btn-clr'}
          onClick={() => goToRoom(uniqueId())}
        >
          Create New Board
        </button>}
      </div>
      {foundBoard ? 
        <div className={styles['invite-col']}>
          <p className={styles['invite-blurb']}>You have been invited to collaborate on this whiteboard. Choose an alias and you can join.</p>
          <button
            className={styles["enter-room"] + ' btn-clr'}
            onClick={() => goToRoom(foundBoard._id)}
          >
            Join Board
          </button>
          <div>
            <BoardPreview board={foundBoard} goToRoom={goToRoom}></BoardPreview>
          </div>
        </div>
        : (
          <>
          <h2>Choose an Existing Board</h2>
        <div className={styles["previews"]}>
        {boards.map((b, i) => (
          // <span key={i}>Test</span>
          <BoardPreview key={i} board={b} goToRoom={goToRoom}></BoardPreview>
        ))}
      </div>
      </>
      )}
    </div>
  );
}
