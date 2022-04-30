'use strict';
const bcrypt = require("bcrypt");

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync("password", salt);

    try{
      const user = await queryInterface.bulkInsert('User', [{
        full_name: 'John Doe',
        email: "johndoe@test.com",
        username: "johndoe",
        password: hashPassword,
        profile_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200",
        age: 24,
        phone_number: 88123456
      }], {
        returning: ['id']
      });
      
      const userId = user[0]["id"];

      const photo = await queryInterface.bulkInsert('Photo', [{
        title: "lorem ipsum dolor sit amet",
        caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Purus viverra accumsan in nisl. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Amet dictum sit amet justo. Quisque sagittis purus sit amet volutpat consequat mauris nunc congue. Turpis cursus in hac habitasse platea. Vitae tempus quam pellentesque nec nam. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Fusce ut placerat orci nulla pellentesque dignissim enim sit amet. Viverra vitae congue eu consequat. Lectus sit amet est placerat in egestas erat imperdiet sed. Pharetra massa massa ultricies mi quis hendrerit dolor magna eget. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Mattis ullamcorper velit sed ullamcorper morbi tincidunt. Suspendisse sed nisi lacus sed. Pellentesque pulvinar pellentesque habitant morbi tristique senectus.",
        poster_image_url: "https://en.gravatar.com/userimage/193518106/8dd06d2e40054d66db7d672acd303420?size=200",
        UserId: userId
      }], { returning: ["id"] })

      const photoId = photo[0]["id"];
      
      await queryInterface.bulkInsert("Comment", [{
        UserId: userId,
        PhotoId: photoId,
        comment: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et pharetra pharetra massa massa ultricies."
      }])
    }
    catch(e) {
      console.log(e.message)
    }

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
