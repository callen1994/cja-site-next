import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);
const from = "+14154497412";

export const testText = ({ body, to }: { body: string; to: string }) =>
  client.messages.create({ body, to, from });
