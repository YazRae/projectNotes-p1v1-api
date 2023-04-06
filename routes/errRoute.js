import { join, resolve } from "path";

const errRout = (req, res) => {
  res.status(404);

  if (req.accepts("html")) {
    res.sendFile(join(resolve() + "/views/404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "page is not found" });
  } else {
    res.type("txt").send("404 page not found");
  }
};

export default errRout;
