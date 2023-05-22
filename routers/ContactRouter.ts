const express = require("express");
const { getAllData, createData, updateData, deleteData } = require("../controllers/ContactController");

const router: any = express.Router();

// routing api after /api/contact/
router.get('/', getAllData);
router.post('/create', createData)
router.patch('/update', updateData);
router.delete('/delete/:id', deleteData);

export default router;