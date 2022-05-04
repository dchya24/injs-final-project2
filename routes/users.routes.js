const express = require("express");
const router = express.Router()
const controller = require("../controllers/users.controller")
const validator = require("../middlewares/validator")
const userSchema = require("../middlewares/schema/user.schema");
const { verify } = require("../middlewares/auth")

router.post("/register", 
  validator.validateRequest(userSchema.user_register),
  controller.register
)
router.post("/login", 
  validator.validateRequest(userSchema.user_login),
  controller.login
)

router.put("/:userId",
  verify,
  validator.validateParams(userSchema.user_param_userId),
  validator.validateRequest(userSchema.user_update),
  controller.updateUser
)

router.delete("/:userId",
  verify,
  validator.validateParams(userSchema.user_param_userId),
  controller.deleteUser
)

module.exports = router