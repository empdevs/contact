"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ContactController_1 = require("../controllers/ContactController");
const router = express_1.default.Router();
// routing api after /api/contact/
router.get('/', ContactController_1.getAllData);
router.post('/create', ContactController_1.createData);
router.patch('/update', ContactController_1.updateData);
router.delete('/delete/:id', ContactController_1.deleteData);
exports.default = router;
//# sourceMappingURL=ContactRouter.js.map