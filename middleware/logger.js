import { format } from "date-fns";
import { existsSync } from "fs";
import { mkdir, appendFile } from "fs/promises";
import { resolve } from "path";
import { v4 as uuid } from "uuid";

const logEvents = async (message, logFileName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!existsSync(resolve() + "/logs")) {
      await mkdir(resolve() + "/logs");
    }
    await appendFile(resolve() + "/logs/" + logFileName, logItem);
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");

  console.log(`${req.method}\n${req.path}`);

  next();
};

export { logger, logEvents };
