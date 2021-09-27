import Mailgun from "mailgun-js";

//Your api key, from Mailgun’s Control Panel
const apiKey = process.env.MAILGUN_API_KEY as string;
const domain = "mg.connorjamesallen.com";
const from = "CJA Service Account <robot@connorjamesallen.com>";

//We pass the api_key and domain to the wrapper, or it won't be able to identify + send emails
console.log("Crating Mailgun instance");
const mailgun = new Mailgun({ apiKey, domain });

export function sendEmail(to: string, subject: string, html: string) {
  const mail = { from, to, subject, html };
  console.log("mail that I'm sending");
  console.log(mail);
  return mailgun.messages().send(mail);
}
