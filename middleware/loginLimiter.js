import rateLimiter from "express-rate-limit";
import { logEvents } from "./logger.js";

const loginLimiter = rateLimiter({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    message:
      "Too many login attempts from this IP, Please try again after 60 seconds",
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too Many Requests :${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      errLog.log
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeader: true,
  legacyHeaders: false,
});

export default loginLimiter;
