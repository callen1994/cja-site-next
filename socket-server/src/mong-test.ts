import { Response } from "express";
import { fetchOrCreateBoard } from "./WhiteboardService/Whiteboard";

export const MONGO_TEST_HTML = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Mongo Test - CJA Site</title>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>
      html,
      body {
        background-color: #0a0a0a;
        color: #fff;
        font-family: sans-serif;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <h1>MESSAGE</h1>
    <p>
    <code>
      TEST_DOCUMENT
    </code>
    </p>
    
  </body>
</html>
`;

export function mongoTest(res: Response, mongoErr: string) {
  const makePage = (message: string, data: string) =>
    res.send(
      MONGO_TEST_HTML.split("MESSAGE")
        .join(message)
        .split("TEST_DOCUMENT")
        .join(data)
    );
  if (mongoErr) return makePage("Mongo Server not Connected", mongoErr);

  fetchOrCreateBoard("test", "Test Whiteboard").then(
    (testDoc) => makePage("Mongo Is running", JSON.stringify(testDoc, null, 2)),
    (err) => makePage("Error fetching from MongoDB :/", err.toString())
  );
}
