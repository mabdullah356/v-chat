const bcrypt = require("bcryptjs");
const User = require("../Models/user.model");
const generateToken = require("../Utils/jwtToken");


//signup controller for creating user

const Signup = async (req,res)=>{

    const {fullName ,email,username,password} = req.body;

    if(!fullName || !email || !username|| !password){
        return res.status(400).json({message:"All fields are required"})
    };


    try {
    
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({message :"User with this email already exists"})
        };

        const existingUsername  = await User.findOne({username})
        if(existingUsername){
            return res.status(409).json({message :"Username must be unique, try a different username"})
        };
        
        const hashPassword = await bcrypt.hash(password,12);

        const user = new User({fullName,email,username,password:hashPassword})

        await user.save();

      const token =  await generateToken(res,user);
        return res.status(201).json({message:"User registered successfully",user:{
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            username :user.username,
            avatar:user.avatar
        },
        token    
    })

    } catch (error) {
        console.error(error);
        if(error.code === 11000){
            const field = Object.keys(error.keyPattern)[0];
            return res.status(409).json({message:`${field} already exists`})
        }
        res.status(500).json({message:"Internal server error"})
    }
};

//login controller for user
const Login = async (req,res)=>{

    const {email,password} = req.body;

    if(!email || !password){
        return res.status(400).json({message:"All fields are required"})
    };


    try {
    
        const user = await User.findOne({email});
        if(!user){
            return res.status(409).json({message :"Invalid Credentials"})
        };

        const comparePassword  = await bcrypt.compare(password,user.password);
        if(!comparePassword){
            return res.status(409).json({message :"Invalid Credentials"})
        };
        
        const token =  await generateToken(res,user);
        return res.status(201).json({message:"User Login successfully",
            user:{
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            username :user.username,
            avatar:user.avatar
        },
        token    
    })

    } catch (error) {
        console.error(error);
        res.status(500).json({message:"Internal server error"})
    }
};


module.exports = {Signup,Login}