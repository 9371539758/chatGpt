import express from "express";
const authRouter = express.Router();
import { register , login} from "../controllers/register.controller.js";
import {validateRegister,validateLogin} from "../validators/auth.validtor.js";
 
authRouter.post("/register", validateRegister, register);
authRouter.post("/login", validateLogin, login);
export default authRouter;