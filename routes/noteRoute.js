import { Router } from "express";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../controllers/notesController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const noteRoute = Router();

noteRoute.use(verifyJWT);

noteRoute
  .route("/")
  .get(getAllNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote);

export default noteRoute;
