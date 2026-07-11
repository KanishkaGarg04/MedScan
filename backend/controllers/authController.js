const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

exports.register = async (req,res)=>{

    try{

        const {name,email,password}=req.body;


        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                message:"User already exists"
            });
        }


        const hashedPassword = await bcrypt.hash(password,10);


        const user = await User.create({
            name,
            email,
            password:hashedPassword
        });


        res.status(201).json({
            message:"Registered successfully",
           user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
    }
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



exports.login = async(req,res)=>{

    try{

        const {email,password}=req.body;


        const user = await User.findOne({email});


        if(!user){
            return res.status(404).json({
                message:"User not found"
            });
        }


        const match = await bcrypt.compare(
            password,
            user.password
        );


        if(!match){
            return res.status(401).json({
                message:"Invalid password"
            });
        }


        const token = jwt.sign(
            {
                id:user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn:"7d"
            }
        );


        res.json({
            message:"Login successful",
            token,
            user:{
                id:user._id,
                name:user.name,
                email:user.email,
                createdAt: user.createdAt
            }
        });


    }catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};
exports.uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
      });
    }

    user.profilePic = `http://localhost:5000/uploads/${req.file.filename}`;

    await user.save();

    res.json({
      message: "Profile picture updated",
      profilePic: user.profilePic,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};