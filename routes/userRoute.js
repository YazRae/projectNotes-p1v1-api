import { Router } from "express";
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/usersController.js";
import verifyJWT from "../middleware/verifyJWT.js";

const userRouter = Router();

userRouter.use(verifyJWT);

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser);

export default userRouter;
