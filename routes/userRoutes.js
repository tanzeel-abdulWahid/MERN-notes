import express from "express";
const router = express.Router();
import { getAllUsers, updateUser, deleteUser, createNewUser } from "../controllers/usersController.js";
import {verifyJWT} from '../middleware/verifyJWT.js';

// run verifyJWT middleware to all user routes
router.use(verifyJWT);

router.route('/')
        .get(getAllUsers)
        .post(createNewUser)
        .patch(updateUser)
        .delete(deleteUser)

export default router
