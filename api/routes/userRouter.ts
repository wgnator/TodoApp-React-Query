import express from "express";
import refreshAccessToken from "../routes/refresh";

import * as authController from "../controllers/authController";

const router = express.Router();

router.post("/login", authController.login);
router.post("/create", authController.signUp);
router.use("/refresh", refreshAccessToken);
router.use("/logout", authController.logout);
export default router;
