import User from '../model/user.model.js'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'
import { sendWelcomeEmail } from '../emails/emailHandlers.js';

export const signUp = async(req,res)=>{
  try {
    const {name,password,email,userName} = req.body;

    if(!name || !password || !email || !userName){
        return res.status(400).json({message:'All fields are required'})
    }

    const existingEmail = await User.findOne({email});
    if(existingEmail){
        return res.status(400).json({message: 'Email exist already'})
    }

    const existingUser = await User.findOne({userName})
    if(existingUser){
        return res.status(400).json({message: 'username exist already'})
    }

    

    if(password.length < 6){
        return res.status(400).json({message: 'password must be at least 6 characters'})
    }

    // hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user = new User({
        name,
        email,
        password:hashedPassword,
        userName
    })

    await user.save();
    console.log(user)

    const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:"3d"})
    res.cookie('jwt-linkedIn',token,{
        httpOnly:true, // prevents xss attacks
        maxAge: 3 * 24 * 60 *  60 *1000,
        sameSite:'strict',
        secure:process.env.NODE_ENV === 'production'
    })

    res.status(201).json({message:'user registered successfully'});

    const profileUrl = process.env.CLIENT_URL+"/profile/"+user.userName

    try {
        await sendWelcomeEmail(user.email,email.name,profileUrl)
    } catch (emailError) {
        console.error("Error sending welcome email",emailError)
    }


  } catch (error) {
    console.log('error in signing In',error.message)
     res.status(500).json({message:'Internal server error'});
  }
}

export const logIn = async(req,res)=>{
    try {
        const {userName,password} = req.body;

        // check if user has been created already
        const user = await User.findOne({userName})
        if(!user){
            return res.status(400).json({message: 'Invalid credential'})
        }

        //check password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: 'Invalid credentialsss'})
        }

        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET, {expiresIn:"3d"})
     await  res.cookie('jwt-linkedIn',token,{
            httpOnly:true, // prevents xss attacks
            maxAge: 3 * 24 * 60 *  60 *1000,
            sameSite:'strict',
            secure:process.env.NODE_ENV === 'production'
        })
        res.json({message:'logged in successfully'});
    } catch (error) {
        console.log('Error in login controller:',error)
         return res.status(400).json({message: 'Invalid credential'})
    }
} 

export const logOut = (req,res)=>{
   res.clearCookie('jwt-linkedIn')
   res.json({message: 'logged out successfully'})
}


export const getCurrentUser = async(req,res)=>{
    try {
        res.json(req.user) 
    } catch (error) {
       console.error('error in getting user',error)
        res.status(500).json({message: 'Current User not found'})
    }
}