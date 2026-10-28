import { Router } from "express";
import { changePassword, deactivateMe, getAvatar, removeAvatar, updateMe, uploadAvatar } from "../controllers/auth.controller.ts"
import { authenticate } from "../middleware/auth.middleware.ts";

const router = Router();

// Mọi route trong file này đều cần đăng nhập
router.use(authenticate);

router.put("/me", updateMe);
router.get("/me/avatar", getAvatar);
router.post("/me/avatar", uploadAvatar);
router.delete("/me/avatar", removeAvatar);
router.delete("/me", deactivateMe);
router.put("/me/password", changePassword);

export default router;