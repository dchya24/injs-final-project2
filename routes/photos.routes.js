const express = require("express");
const router = express.Router();
const controller = require("../controllers/photos.controllers");
const { verify } = require("../middlewares/auth");
const validator = require("../middlewares/validator");
const photoScema = require("../middlewares/schema/photo.scema")

router.post("/",
  verify,
  validator.validateRequest(photoScema.photo_create),
  controller.createPhoto
)

router.get("/", verify, controller.getPhotos);
module.exports = router