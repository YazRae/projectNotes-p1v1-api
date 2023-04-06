import { Router } from "express";
import { login, refresh, logout } from "../controllers/authController.js";
import loginLimiter from "../middleware/loginLimiter.js";

const AuthRoute = Router();

AuthRoute.route("/").post(loginLimiter, login);

AuthRoute.route("/refresh").get(refresh);

AuthRoute.route("/logout").post(logout);

export default AuthRoute;
