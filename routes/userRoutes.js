import express from "express";
const router = express.Router();
import { getAllUsers, updateUser, deleteUser, createNewUser } from "../controllers/usersController.js";

router.route('/')
        .get(getAllUsers)
        .post(createNewUser)
        .patch(updateUser)
        .delete(deleteUser)

export default router
