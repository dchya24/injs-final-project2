const joi = require("joi");

exports.socmed_create = joi.object({
    social_media_url: joi.string().trim().uri().required(),
    name: joi.string().trim().required()
});

exports.socmed_params = joi.object({
    socmedId: joi.number().required()
});