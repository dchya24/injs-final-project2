const joi = require("joi");

exports.photo_create = joi.object({
  poster_image_url: joi.string().trim().uri().required(),
  title: joi.string().trim().required(),
  caption: joi.string().trim().required()
});

exports.params_photoId = joi.object({
  photoId: joi.number().required()
});