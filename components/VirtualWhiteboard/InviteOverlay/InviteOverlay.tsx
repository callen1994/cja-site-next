import { useRouter } from "next/router";
import React, { useRef, useState } from "react";
import CloseIcon from "../../Icons/CloseIcon";
import { httpProm, InputChange } from "../../utils";
import styles from "./InviteOverlay.module.css";

export default function InviteOverlay() {
  const [phoneErr, setPhoneErr] = useState(false);
  const [emailErr, setEmailErr] = useState(false);
  const router = useRouter();
  const number = useRef("");
  const email = useRef("");
  // Site your source! https://stackoverflow.com/questions/17651207/mask-us-phone-number-string-with-javascript
  const numberMask = (e: InputChange) => {
    setPhoneErr(false);
    var x = e.target.value
      .replace(/\D/g, "")
      .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
    if (x)
      e.target.value = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    number.current = e.target.value.replace(/\D/g, "");
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const validateNumber = (phone: string) =>
    // There are 10 characters, there are 10 digits, and the first character insn't 1 (no areacodes start with 1)
    phone.length === 10 && phone.match(/\d/g)?.length === 10 && phone[0] != "1";

  const sendPhone = () => {
    if (!validateNumber(number.current)) return setPhoneErr(true);
    console.log(
      `Sending ${JSON.stringify(router.query)} to this number: ${
        number.current
      }`
    );
    httpProm(
      process.env.NODE_ENV === "production"
        ? "https://connorjamesallen.com/api/text-invite"
        : "http://localhost:3000/api/text-invite",
      {
        method: "PUT",
        body: {
          to: "+1" + number.current,
          room: router.query.room,
          user: router.query.user,
        },
      }
    ).then(console.log, console.error);
  };

  const sendEmail = () => {
    console.log(email.current);
    if (!validateEmail(email.current)) return setEmailErr(true);
    console.log(`Sending ${router.query} to this email: ${email.current}`);
  };

  return (
    <div className={styles["InviteOverlay"]}>
      <div className={styles["overlay-content"]}>
        <button className={styles["close"]}>
          <CloseIcon />
        </button>
        <h2>Invite Someone</h2>
        <div
          className={styles["invite"] + (phoneErr ? " " + styles["err"] : "")}
          data-err="Invalid Phone"
        >
          <label htmlFor="phone">Invite By Text</label>
          <input
            type="text"
            id="phone"
            placeholder="(xxx) xxx-xxxx"
            onChange={numberMask}
          />
          <button className={styles["send"]} onClick={sendPhone}>
            Send
          </button>
        </div>
        <div
          className={styles["invite"] + (emailErr ? " " + styles["err"] : "")}
          data-err="Invalid Email"
        >
          <label htmlFor="email">Invite By Email</label>
          <input
            type="text"
            id="email"
            placeholder="user@example.com"
            onChange={(e) => {
              setEmailErr(false);
              email.current = e.target.value;
            }}
          />
          <button className={styles["send"]} onClick={sendEmail}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
