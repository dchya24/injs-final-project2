const { User } = require("../models");
const bcryptHelper = require("../helpers/bcrypt");
const auth = require("../middlewares/auth");

exports.register = async(req, res, next) => {
  try{
    const {
      email,
      full_name,
      username,
      password,
      profile_image_url,
      age,
      phone_number
    } = req.body;

    const checkUser = await User.findOne({
      where: {
        email: email
      }
    })

    if(checkUser){
      return res.status(402)
        .json({
          status: "Fail",
          message: "Email was registered!"
        })
    }

    const hashPassword = bcryptHelper.hash(password);

    const user = await User.create({
      "email": email,
      "full_name": full_name,
      "username": username,
      "password": hashPassword,
      "profile_image_url": profile_image_url,
      "age": age,
      "phone_number": phone_number
    })

    delete user["id"];
    delete user["password"];
    delete user["createdAt"];
    delete user["updatedAt"];
    

    return res.status(201)
      .json({
        user : user
      })
  }
  catch(e){
    next(e)
  }
}

exports.login = async(req, res, next) => {
  try{
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email: email }});
  
    if(!user){
      return res.status(400)
        .json({
          message: "User not found"
        });
    }
  
    const isValid = bcryptHelper.compare(password, user.password)
  
    if(!isValid){
      return res.status(403)
        .json({
          message: "Password not valid"
        });
    }
  
    const token = auth.generateToken({
      id: user.id,
      email: user.email,
      name: user.full_name
    })
  
    return res.status(200)
    .json({
        token: token
    });
  }
  catch(e){
    next(e)
  }
}