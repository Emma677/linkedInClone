import jwt from 'jsonwebtoken'
import User from '../model/user.model.js';

export const protectedRoute = async(req,res,next)=>{
    try {
        const token = req.cookies['jwt-linkedIn']
        if(!token){
            return res.status(401).json({message: 'Unauthoried - No Token provied'})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message: 'Unauthoried - invalid'})
        }

        const user = await User.findById(decoded.userId).select("-password")
        if(!user){
            return res.status(401).json({message:'User not found'})
        }

        req.user = user;
        next()
    } catch (error) {
        console.log("error in Protected route middleware",error.message)
        return res.status(500).json({message:'User not found'})
    }
}