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

    delete photo.dataValues.createdAt
    delete photo.dataValues.updatedAt
  
    return res.status(201)
    .json(photo)
  }
  catch(e){
    console.log(e);
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

exports.updatePhotos = async(req, res, next) => {
  try{
    const photoId = req.params.photoId;
    const userId = req.userId;
    const {
      title,
      caption,
      poster_image_url
    } = req.body;
  
    const photo = await Photo.findOne({ 
      where: { 
        id: photoId,
        UserId: userId
      }
    });
  
    if(!photo){
      return res.status(404)
      .json({
        message: "Photo not found!"
      });
    }
  
    photo.title = title;
    photo.caption = caption;
    photo.poster_image_url = poster_image_url;
  
    await photo.save();

    return res.status(200)
    .json({
      photo: photo
    });
  }
  catch(e){
    next(e);
  }
}

exports.deletePhoto = async(req, res, next) => {
  try{
    const userId = req.userId;
    const photoId = req.params.photoId;

    const photo = await Photo.destroy({
      where: {
        id: photoId,
        UserId: userId
      }
    });

    if(!photo){
      return res.status(404)
      .json({
        message: "Photo not found!"
      });
    }

    return res.status(200)
    .json({
      message: "Your photo has been successfully deleted"
    });
  }
  catch(e){
    next(e);
  }
}