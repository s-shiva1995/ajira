import express from "express";
import * as dotenv from "dotenv";
import { SqlLiteData } from "./data";
import { ProcessCommand } from "./methods";

dotenv.config();

const application: express.Application = express();
application.use((req, res, next) => {
  let data = "";
  req.setEncoding("utf-8");
  req.on("data", (chunk) => data += chunk);
  req.on("end", () => {
    req.body = data;
    next();
  });
});

const database = new SqlLiteData();
database.init();

application.post("/ajira/process", async (req, res) => {
  const { body } = req;
  if (!body) {
    return res.status(400).send("Invalid request").end();
  }
  try {
    const result = await ProcessCommand.processCommand(database, body);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send(error);
  }
});

application.listen(process.env.SERVER_PORT, () => {
  console.info(`Server started at port: ${process.env.SERVER_PORT}`);
});