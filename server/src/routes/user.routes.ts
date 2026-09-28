import { Router } from "express";
import { updateMe, changePassword } from "../controllers/auth.controller.ts"
import { authenticate } from "../middleware/auth.middleware.ts";

const router = Router();

// Mọi route trong file này đều cần đăng nhập
router.use(authenticate);

router.put("/me", updateMe);
router.put("/me/password", changePassword);

export default router;