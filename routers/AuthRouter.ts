import express, { Router } from "express";
import { login } from "../controllers/AuthController";

const router : Router = express.Router();

// routing api after /api/auth/
router.post('/', login);


export default router;