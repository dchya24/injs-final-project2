const joi = require("joi");

exports.comment_create = joi.object({
    comment: joi.string().trim().required()
});

exports.params_photoId = joi.object({
    photoId: joi.number().required()
});