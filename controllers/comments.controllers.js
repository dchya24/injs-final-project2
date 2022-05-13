const { Comment, User } = require("../models");

exports.createComment = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {
            comment,
            photoId
        } = req.body;
        const comments = await Comment.create({
            comment: comment,
            PhotoId: photoId,
            UserId: userId
        })

        return res.status(201)
            .json(comments)
    }
    catch (e) {
        console.log(e);
        next(e);
    }
}

exports.getComment = async (req, res, next) => {
    try {
        const userId = req.userId;
        const comments = await Comment.findAll({
            include: [
                {
                    model: User,
                    as: 'User',
                    attributes: ['id', 'username', 'profile_image_url']
                }
            ],
            where: { UserId: userId },
            subQuery: false
        });

        return res.status(200)
            .json({
                comments: comments
            });
    }
    catch (e) {
        next(e);
    }
}

exports.updateComment = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {
            comment,
            photoId
        } = req.body;

        const comments = await Comment.findOne({
            where: {
                UserId: userId
            }
        });

        if (!comments) {
            return res.status(404)
                .json({
                    message: "Comment not found!"
                });
        }

        comments.comment = comment;
        comments.PhotoId = photoId;

        await comments.save();

        return res.status(200)
            .json({
                comments: comments
            });
    }
    catch (e) {
        next(e);
    }
}

exports.deleteComment = async (req, res, next) => {
    try {
        const userId = req.userId;

        const comments = await Comment.destroy({
            where: {
                UserId: userId
            }
        });

        if (!comments) {
            return res.status(404)
                .json({
                    message: "Comment not found!"
                });
        }

        return res.status(200)
            .json({
                message: "Your comment has been successfully deleted"
            });
    }
    catch (e) {
        next(e);
    }
}
