const express = require("express");
const { login } = require("../controllers/AuthController");

const router: any = express.Router();

// routing api after /api/auth/
router.post('/', login);


export default router;