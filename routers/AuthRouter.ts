import express, { Router } from "express";
import { login, refreshToken } from "../controllers/AuthController";

const router : Router = express.Router();

// routing api after /api/auth/
router.post('/', login);
router.post('/refreshToken', refreshToken);


export default router;