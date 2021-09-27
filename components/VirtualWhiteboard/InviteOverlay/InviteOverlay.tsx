import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import CloseIcon from "../../Utilities/Icons/CloseIcon";
import { httpProm, InputChange } from "../../Utilities/utils";
import styles from "./InviteOverlay.module.css";

interface Props {
  close: () => void;
}

type ChangeHandler = React.ChangeEventHandler<HTMLInputElement>;

const hostEndpoint =
  process.env.NODE_ENV === "production"
    ? "https://connorjamesallen.com/api/"
    : "http://localhost:3000/api/";

const condStyle = (cond: any, val: string) => (cond ? styles[val] : "");

export default function InviteOverlay({ close }: Props) {
  const [phoneNot, setPhoneNot] = useState("");
  const [emailNot, setEmailNot] = useState("");
  const router = useRouter();
  const number = useRef("");
  const email = useRef("");

  // Site your source! https://stackoverflow.com/questions/17651207/mask-us-phone-number-string-with-javascript
  const numberChange: ChangeHandler = (e) => {
    setPhoneNot("");
    var x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (x)
      e.target.value = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    number.current = e.target.value.replace(/\D/g, "");
  };

  const emailChange: ChangeHandler = (e) => {
    setEmailNot("");
    email.current = e.target.value;
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateNumber = (phone: string) =>
    // There are 10 characters, there are 10 digits, and the first character insn't 1 (no areacodes start with 1)
    phone.length === 10 && phone.match(/\d/g)?.length === 10 && phone[0] != "1";

  const getInviteBody = (to: string) => {
    const { room, user } = router.query;
    return { to, room, user: decodeURIComponent(user as string) };
  };

  const makeHandlers = (setNot: (x: string) => void) => {
    const timeoutReset = () => setTimeout(() => setNot(""), 1800);
    return [
      (suc: any) => {
        console.log(suc);
        setNot("Successfully Sent");
        timeoutReset();
      },
      (err: any) => {
        console.error(err);
        setNot("Error Sending...");
        timeoutReset();
      },
    ];
  };

  const sendPhone = () => {
    if (!validateNumber(number.current)) return setPhoneNot("Invalid Phone");
    setPhoneNot("Sending...");
    const to = "+1" + number.current;
    const body = getInviteBody(to);
    const [suc, err] = makeHandlers(setPhoneNot);
    httpProm(hostEndpoint + "text-wb-invite", { method: "PUT", body }).then(
      suc,
      err
    );
  };

  const sendEmail = () => {
    if (!validateEmail(email.current)) return setEmailNot("Invalid Email");
    setEmailNot("Sending...");
    const to = email.current;
    const body = getInviteBody(to);
    const [suc, err] = makeHandlers(setEmailNot);
    httpProm(hostEndpoint + "email-wb-invite", { method: "PUT", body }).then(
      suc,
      err
    );
  };

  const noBubble: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  const inviteForm = (
    send: () => void,
    onChagne: ChangeHandler,
    notify: string,
    placeholder: string
  ) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send();
      }}
      className={[
        styles["invite"],
        condStyle(notify, "notify"),
        condStyle(
          notify.includes("Invalid") || notify.includes("Error"),
          "err"
        ),
        condStyle(notify.includes("Success"), "suc"),
      ].join(" ")}
    >
      <label>Invite By Text</label>
      <div data-notify={notify}>
        <input type="text" placeholder={placeholder} onChange={onChagne} />
        <button className={styles["send"] + " btn-clr"} type="submit">
          Send
        </button>
      </div>
    </form>
  );

  return (
    <div
      className={styles["InviteOverlay"]}
      onClick={close}
      onKeyUp={(e) => (e.key === "Escape" ? close() : "")}
    >
      <div className={styles["overlay-content"]} onClick={noBubble}>
        <button className={styles["close"]} onClick={close}>
          <CloseIcon />
        </button>
        <h2>Invite Someone</h2>
        {inviteForm(sendPhone, numberChange, phoneNot, "(xxx) xxx-xxxx")}
        {inviteForm(sendEmail, emailChange, emailNot, "user@example.com")}
        <div>
          <div>Invite Link:</div>
          <div className={styles["invite-link"]}>
            https://connorjamesallen.com/virtual-whiteboard?room=
            {router.query.room}
          </div>
        </div>
      </div>
    </div>
  );
}
