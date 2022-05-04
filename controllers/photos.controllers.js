const { Photo, Comment, User } = require("../models");

exports.createPhoto = async(req, res, next) => {
  try{
    const userId = req.userId;
    const {
      poster_image_url,
      title,
      caption
    } = req.body;
  
    const photo = await Photo.create({
      title: title,
      caption: caption,
      poster_image_url: poster_image_url,
      UserId: userId
    })
  
    return res.status(201)
    .json(photo)
  }
  catch(e){
    next(e);
  }
}

exports.getPhotos = async(req, res, next) => {
  try{
    const userId = req.userId;

    const photos = await Photo.findAll({
      include: [
        {
          model: Comment,
          as: 'Comments',
          attributes: ['comment'],
          include: [{
            model: User,
            required: true,
            as: 'User',
            attributes: ['username'],
          }]
        },
        {
          model: User,
          as: 'User',
          attributes: ['id', 'username', 'profile_image_url']
        }
      ],
      where: { UserId: userId},
      subQuery: false
    });

    return res.status(200)
    .json({
      photos: photos
    });
  }
  catch(e){
    next(e);
  }
}