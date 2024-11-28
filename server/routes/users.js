import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  getUsers,
  getRole,
} from "../controllers/user.js";
import { verifyToken, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

//UPDATE
router.put("/:id", verifyUser, updateUser);

//DELETE
router.delete("/:id", verifyUser, deleteUser);

//GET
router.get("/:id", getUser);
router.get("/role/:role", getRole); // Kiểm tra quyền token thay vì admin

//GET ALL
router.get("/", getUsers); // Kiểm tra quyền token thay vì admin

export default router;
