import User from '../models/user.js';
import Note from '../models/Note.js';
import asyncHandler from 'express-async-handler';
import bycrypt from 'bcrypt';
import mongoose from 'mongoose';

export const getAllUsers = asyncHandler(async (req, res) => {
        // lean returns a javascript object instead of mongoose document
        const users = await User.find().select("-password").lean()
        if(!users?.length){
                return res.status(400).json({ message: 'No user found ' })
        }
        res.json({users})
})

export const createNewUser = asyncHandler(async (req, res) => {
        const {username, password, roles} = req.body;

        if (!username || !password || !Array.isArray(roles) || !roles.length) {
                return res.status(400).json({message: "All fields are required"})
        }

        // lean returns a javascript object instead of mongoose document
        const duplicate = await User.findOne({ username }).lean().exec();

        if(duplicate) return res.status(409).json({message: "Duplicate Users found"})

        // Hash password
        const hashedPass = await bycrypt.hash(password,10);
        const userObject = {username, "password":hashedPass, roles}
        const user = await User.create(userObject);

        if(user) res.status(200).json({message: "Successfully created user"})
        else res.status(400).json({message: "Invalid Credential"})
})


export const updateUser = asyncHandler(async (req, res) => {
        const { id, username, roles, active, password } = req.body;

        if (!id || !username || !Array.isArray(roles) || !roles.length || typeof active !== 'boolean'  ){
                return res.status(400).json({ message: "all fields are required except password"})
        }

        if(!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "invalid id"})

        // user sxists?
        const user = await User.findById(id).exec();
        // console.log("user", user);

        if(!user) return res.status(400).json({ message: "user not found"})


        const duplicate = await User.findOne({username}).lean().exec();
        if(duplicate && duplicate?._id.toString() !== id){
                return res.status(409).json({message: "duplicate users found"})
        }

        user.username = username;
        user.roles = roles;
        user.active = active;

        if (password) user.password = await bycrypt.hash(password,10)
        const updatedUser = await user.save();
        res.json({message: `${updatedUser.username} updated`})

})


export const deleteUser = asyncHandler(async (req, res) => {
        const {id} = req.body;
        if(!id) return res.json({message: "user Id required"});
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "invalid id" })

        //user has assigned notes?
        const notes = await Note.findOne({user:id }).lean().exec();
        console.log("notes",notes);
        if(notes) return res.status(400).json({message: "User has assigned notes"})

        const user = await User.findById(id).exec();
        if(!user) return res.status(400).json({message: "user not found"})
        
        const result = await user.deleteOne();
        res.json(`Username ${result.username} with ID ${result.id} deleted`)
})
