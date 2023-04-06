import express from "express";
import path from "path";

const __dirname = path.resolve();
const router = express.Router();
const join = path.join;

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(join(__dirname, "views/index.html"));
});

export default router;
