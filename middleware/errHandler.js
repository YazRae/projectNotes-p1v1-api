import { logEvents } from "./logger.js";

const errHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}${req.url}\t${req.headers.origin}`,
    "errlog.log"
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500;

  res.status(status);

  res.json({ message: err.message, isError: true });
};

export default errHandler;
