const joi = require("joi");

const user_register = joi.object({
  email: joi.string().trim().email().required(),
  full_name: joi.string().trim().required(),
  username: joi.string().trim().required(),
  password: joi.string().trim().required(),
  profile_image_url: joi.string().trim().uri().required(),
  age: joi.number().required(),
  phone_number: joi.number().required()
})

const user_login = joi.object({
  email: joi.string().trim().email().required(),
  password: joi.string().trim().required(),
})

module.exports = {
  user_register,
  user_login
}