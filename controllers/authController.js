import User from '../models/user.js';
import bycrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const login = asyncHandler(async (req, res) => {
    const {username, password} = req.body;

    if (!username || !password) {
        return res.status(400).json({message: 'all fields are requires'})
    }
    const foundUser = await User.findOne({username}).exec();

    if (!foundUser || !foundUser.active) return res.status(401).json({message: 'Unauthorize'})

    const match = await bycrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({message: 'Unauthorize'})

    const accessToken = jwt.sign(
        {"UserInfo":{
            "username": foundUser.username,
            "roles":foundUser.roles
        }},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:'1hr'}
    )

    const refreshToken = jwt.sign(
        {"username":foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '7d'}
    )
    //create cookie with refresh token

    res.cookie('jwt', refreshToken,{
        httpOnly:true, //accessible by only web browser
        sameSite:'none',
        maxAge:  7 * 24 * 60 * 60 * 1000 //cookie expiry
    })
    // Send accessToken containing username and roles 
    res.json({accessToken})

})

export const refresh = (req, res) => {

    const cookies = req.cookies;

    //checking if there is a cookie named jwt;
    if (!cookies?.jwt) return res.status(401).json({message:'Unauthorize'});

    const refreshToken = cookies.jwt;

    //verifying the refresh token with the ref token in cookie; 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        asyncHandler(async(err, decoded) => {
            if (err) return res.status(403).json({message: 'Forbidden refresh'})

            const foundUser = await User.findOne({username: decoded.username}).exec()
            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            // creating new access token.
            const accessToken = jwt.sign(
                {"UserInfo":{
                    "username": foundUser.username,
                    "roles":foundUser.roles
                }},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:'1hr'}
            )
        res.json({accessToken})

        }),
    )
    
}

export const logout = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204) //no content
    res.clearCookie('jwt',{httpOnly:true, sameSite:'None'})
    res.json(
        {message: 'Cookie cleared'}
    )
}