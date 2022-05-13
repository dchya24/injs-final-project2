const joi = require("joi");

exports.comment_create = joi.object({
    comment: joi.string().trim().required(),
    photoId: joi.number().required()
});

exports.comment_update = joi.object({
    comment: joi.string().trim().required()
})

exports.params_commentId = joi.object({
    commentId: joi.number().required()
});
