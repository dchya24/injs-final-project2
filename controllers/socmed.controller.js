const { SocialMedia, User } = require("../models");

exports.createSocmed = async (req, res, next) => {
    try {
        const userId = req.userId;
        const {
            social_media_url,
            name,
        } = req.body;

        const social_media = await SocialMedia.create({
            name: name,
            social_media_url: social_media_url,
            UserId: userId,

        })

        return res.status(201)
            .json({ social_media: social_media })
    }
    catch (e) {
        console.log(e);
        next(e);
    }
}

exports.getSocmed = async (req, res, next) => {
    try {
        const userId = req.userId;
        const social_medias = await SocialMedia.findAll({
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
                social_medias: social_medias
            });
    }
    catch (e) {
        next(e);
    }
}

exports.updateSocmed = async (req, res, next) => {
    try {
        const userId = req.userId;
        const socialMediaId = req.params.socmedId;
        
        const {
            social_media_url,
            name
        } = req.body;

        const social_media = await SocialMedia.findOne({
            where: {
                UserId: userId,
                id: socialMediaId
            }
        });

        if (!social_media) {
            return res.status(404)
                .json({
                    message: "SocialMedia not found!"
                });
        }

        social_media.name = name;
        social_media.social_media_url = social_media_url;

        await social_media.save();

        return res.status(200)
            .json({
                social_media: social_media
            });
    }
    catch (e) {
        next(e);
    }
}

exports.deleteSocmed = async (req, res, next) => {
    try {
        const userId = req.userId;
        const socmedId = req.params.socmedId;

        const social_media = await SocialMedia.destroy({
            where: {
                UserId: userId,
                id: socmedId
            }
        });

        if (!social_media) {
            return res.status(404)
                .json({
                    message: "SocialMedia not found!"
                });
        }

        return res.status(200)
            .json({
                message: "Your social media has been successfully deleted"
            });
    }
    catch (e) {
        next(e);
    }
}