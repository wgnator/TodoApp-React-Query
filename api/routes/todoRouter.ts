import express from "express";

import * as todoController from "../controllers/todoController";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.use(verifyToken);

router.get("/", todoController.getTodos);
router.post("/", todoController.createTodo);
router.get("/:id", todoController.getTodoById);
router.put("/:id", todoController.updateTodo);
router.delete("/:id", todoController.deleteTodo);

export default router;
