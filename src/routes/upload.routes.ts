import { Router } from "express";
import { uploadLogbook } from "../controllers/upload.controller";

const router = Router();

router.post("/", uploadLogbook);

export default router;
