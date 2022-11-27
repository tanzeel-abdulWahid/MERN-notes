import express from 'express';
const router = express.Router();
import { getAllNotes, createNewNote, updateNote, deleteNote } from '../controllers/noteControllers.js';
import {verifyJWT} from '../middleware/verifyJWT.js';

// run verifyJWT middleware to all notes routes
router.use(verifyJWT);

router.route('/')
        .get(getAllNotes)
        .post(createNewNote)
        .patch(updateNote)
        .delete(deleteNote)
        
export default router