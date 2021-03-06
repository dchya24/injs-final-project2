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

    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;

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
  
    const isValid = bcryptHelper.compare(password, user.password);
  
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

exports.updateUser = async(req, res, next) => {
  try{
    const userId = req.params.userId
    if(req.userId != userId){
      return res.status(401)
        .json({
          "message": "Error unauthorized" 
        })
    }
    
    const {
      email,
      full_name,
      username,
      profile_image_url,
      age,
      phone_number
    } = req.body;

    const user = await User.findOne({
      where: { id: userId}
    });

    if(!user){
      return res.status(400)
        .json({
          message: "User not found"
        });
    }

    user.update({
      "email": email,
      "full_name": full_name,
      "username": username,
      "profile_image_url": profile_image_url,
      "age": age,
      "phone_number": phone_number
    });

    await user.save();

    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    
    return res.status(200)
      .json({
        "user": user
      });
  }
  catch(e){
    console.log(e.message)
    next(e);
  }
}

exports.deleteUser = async (req, res, next) => {
  try{
    const userId = req.params.userId;
    if(req.userId != userId){
      return res.status(401)
        .json({
          "message": "Error unauthorized" 
        })
    }

    await User.destroy({
      where: { id: userId }
    })

    return res.status(200)
      .json({
        message: "Your account has been successfully deleted"
      });
  }
  catch(e){
    next(e);
  }
}

exports.getUser = async (req, res, next) => {
  try{
    const userId = req.userId;
    const user = await User.findByPk(userId);
    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;

    return res.status(200)
      .json({
        user: user
      });
  }
  catch(e){
    next(e);
  }
}