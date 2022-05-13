const joi = require("joi");

exports.socmed_create = joi.object({
    social_media_url: joi.string().trim().uri().required(),
    name: joi.string().trim().required()
});

exports.params_userId = joi.object({
    userId: joi.number().required()
});