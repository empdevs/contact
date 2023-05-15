import express, { Router } from "express";
import { getAllData, createData, updateData, deleteData } from "../controllers/ContactController";

const router : Router = express.Router();

// routing api after /api/contact/
router.get('/', getAllData);
router.post('/create', createData)
router.patch('/update/:id', updateData);
router.delete('/delete/:id', deleteData);

export default router;