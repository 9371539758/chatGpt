import express from "express";
const authRouter = express.Router();
import { register , login,logoutUser} from "../controllers/register.controller.js";
import {validateRegister,validateLogin} from "../validators/auth.validtor.js";
 
authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
authRouter.post("/logout",logoutUser);
export default authRouter;