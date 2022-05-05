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
);
router.get("/", verify, controller.getPhotos);
router.put("/:photoId",
  verify,
  validator.validateRequest(photoScema.photo_create),
  validator.validateParams(photoScema.params_photoId),
  controller.updatePhotos
);
router.delete("/:photoId",
  verify,
  validator.validateParams(photoScema.params_photoId),
  controller.deletePhoto
);

module.exports = router