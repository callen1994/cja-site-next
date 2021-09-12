import { createTransport } from "nodemailer";

console.log("doing email stuff");
console.log(process.env.GMAIL_PASS);

const transport = createTransport({
  service: "gmail",
  auth: {
    user: "cja.callen@gmail.com",
    pass: process.env.GMAIL_PASS,
  },
});

const testEmail = {
  from: "cja.callen@gmail.com",
  to: "mrconcon@gmail.com",
  subject: "Yello",
  text: "I dont believe you...",
};

export function emailTest() {
  return transport.sendMail(testEmail);
}
