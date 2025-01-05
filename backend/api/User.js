const express=require('express');
const router= express.Router();


//mongodb user model
const User= require('./../models/User');

//password handler
const bcrypt = require('bcrypt');
// Signup
router.post('/signup',(req,res)=>{
    let {name,email,password,dateOfBirth} = req.body;
    name=name.trim();
    email=email.trim();
    password=password.trim();
    dateOfBirth=dateOfBirth.trim();
    if(name == "" || email == "" || password == "" || dateOfBirth == ""){
        res.json({
            status : "Failed",
            message : "Empty input fields!"
        });
    } else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: "FAILED",
            message: "Invalid name entered"
        })

    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: "FAILED",
            message: "Invalid email entered"
        }) 
    } else if (isNaN(new Date(dateOfBirth).getTime())){
        res.json({
            status: "FAILED",
            message: "Invalid date of birth entered"
        })
    } else if(password.length <8){
        res.json({
            status: "FAILED",
            message: "Password too short !"
        })
    } else{
        //checking if user already exists
        User.find({email}).then(result =>{
            if(result.length){
                //A user already exists
                res.json({
                    status: "FAILED",
                    message: "User already exists"
                })
            }else{
                //Try to create new user

                //password handling
                const saltRounds =10;
                bcrypt.hash(password,saltRounds).then(hashedPassword =>{
                        const newUser = new User({
                            name,
                            email,
                            password :hashedPassword,
                            dateOfBirth
                        });
                        
                        newUser.save().then(result=>{
                            res.json({
                                status: "SUCCESS",
                                message: "Signup successful!",
                                data:result,
                            })
                        })
                        .catch(err =>{
                            res.json({
                                status: "FAILED",
                                message: "An error occured while saving user account!"
                            })
                        })
                }).catch(err =>{
                    res.json({
                        status: "FAILED",
                        message: "An error occured while hashing password!"
                    })
                })
            }
        }).catch(err=>{
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occured while checking for existing user!"
            })
        })
    }
})



//signin
router.post('/signin',(req,res)=>{
    let {email,password} = req.body;
    email=email.trim();
    password=password.trim();

    if(email== "" || password == ""){
        res.json({
            status:"Failed",
            message:"Empty credentials provided"
        })
    }
    else{
        //check if the user exists
        User.find({email})
        .then(data =>{
            if(data.length){
                //user exists

                const hashedPassword=data[0].password;
                bcrypt.compare(password,hashedPassword).then(result =>{
                    if(result){
                        //password match
                        res.json({
                            status: "SUCCESS",
                            message:"Signin successful",
                            data:data
                        })
                    }else{
                        res.json({
                            status:"FAILED",
                            message: "Invalid password entered !"
                        })
                    }
                })
                .catch(err =>{
                    res.json({
                        status:"FAILED",
                        message: "An error has occured while compairing passwords!"
                    })
                })
            }
            else{
                res.json({
                    status:"FAILED",
                    message: "Invalid credentials !"
                })
            }
        })
        .catch(err =>{
            res.json({
                status:"FAILED",
                message: "An error has occured while checking for existing user!"
            })
        })
    }
})


module.exports=router;