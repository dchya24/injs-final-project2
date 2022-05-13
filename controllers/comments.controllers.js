const { Comment, User, Photo } = require("../models");

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
            .json({ comment: comments })
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
                    model: Photo,
                    as: 'Photo',
                    attributes: ['id', 'title', 'caption', 'poster_image_url']
                },
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
        const commentId = req.params.commentId
        const {
            comment
        } = req.body;

        const comments = await Comment.findOne({
            where: {
                UserId: userId,
                id: commentId
            }
        });

        if (!comments) {
            return res.status(404)
                .json({
                    message: "Comment not found!"
                });
        }

        comments.comment = comment;

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
        const commentId = req.params.commentId;

        const comments = await Comment.destroy({
            where: {
                UserId: userId,
                id: commentId
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
