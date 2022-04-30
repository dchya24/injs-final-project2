const express = require("express");
const app = express();
const { Comment, Photo, User } = require("./models");

require("dotenv").config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", async (req, res) => {
  try{
    const data = await Photo.findAll({
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
      subQuery: false
    });
    
    res.status(200).json({ photos: data })
  }
  catch(e){
    console.log(e.stack)
    res.status(500)
      .json({ message: e.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server start at port ${PORT}`);
});