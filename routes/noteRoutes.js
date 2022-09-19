import express from 'express';
const router = express.Router();
import { getAllNotes, createNewNote, updateNote, deleteNote } from '../controllers/noteControllers.js';
router.route('/')
        .get(getAllNotes)
        .post(createNewNote)
        .patch(updateNote)
        .delete(deleteNote)
        
export default router