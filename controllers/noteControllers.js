import Note from "../models/Note.js";
import User from "../models/user.js";
import mongoose from 'mongoose';
import asyncHandler from "express-async-handler";

export const getAllNotes = asyncHandler(async(req, res) => {
        const notes = await Note.find().lean();
        if(!notes?.length) return res.status(400).json({message:"no notes found"})
        
        const notesWithUser = await Promise.all(notes.map(async (note) => {
                const user = await User.findById(note.user).lean().exec();
                return {...note, username: user.username}
        }))
        
        res.status(200).json(notesWithUser);
})


export const createNewNote = asyncHandler(async (req, res) => {
        const {_id,title, text} = req.body;
        if (!_id || !title || !text) {
                return res.status(400).json({message: "All fields are requires"})
        }
        if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({essage:"invalid id"});

        const user = await User.findOne({_id}).lean().exec();
        if (!user) return res.status(400).json({message: `No usesr found with ID ${_id}`})

        const duplicate = await Note.findOne({ title }).lean().exec();
        if(duplicate) return res.status(400).json({message:"Duplicate titles found"})

        const note = await Note.create({ user: _id, title, text });

        if (note){ //created?
                res.status(200).json({message: "note created"})
        }else{
                res.status(400).json({message:"invalid credentials"})
        }

})


export const updateNote = asyncHandler(async (req, res) => {
        const {id,  user,title, text, completed} = req.body;
        if (!id || !user || !title || !text || typeof completed !== 'boolean') {
                return res.status(400).json({message:"All fields are required"})
        }
        const note = await Note.findById(id).exec();
        if (!note) return res.status(400).json({message:` No note found for ${id}`});
        const duplicate = await Note.findOne({ title }).lean().exec();
        if (duplicate && duplicate?._id.toString() !== id) {
                return res.status(400).json({ message: "Duplicate titles found" })
        }
        note.user = user;
        note.title = title;
        note.text = text;
        note.completed = completed;
        const updatedNote = await note.save();
        res.json(`'${updatedNote.title}' updated`)
})

export const deleteNote = asyncHandler(async (req, res) => {
        const {id} = req.body;
        if (!id) return res.status(400).json({ message: "Note Id required" });

        const note = await Note.findById(id).exec();
        if (!note) return res.status(400).json({ message: "note not found" });

        const deletedNote = await note.deleteOne();

        res.json(`note deleted having id ${deletedNote.id}`);

})



