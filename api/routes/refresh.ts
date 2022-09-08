import express from "express";
import { handleRefreshAccessToken } from "../controllers/refreshAccessTokenController";
const router = express.Router();

router.get("/", handleRefreshAccessToken);

export default router;
