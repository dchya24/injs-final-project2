'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SocialMedia', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      social_media_url: {
        type: Sequelize.TEXT
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
    .then(() => {
      queryInterface.addConstraint('SocialMedia', {
        type: "foreign key",
        fields: ['UserId'],
        name: "socialmedia_user_fk",
        references: {
          table: 'User',
          field: 'id'
        }
      })
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("SocialMedia", "socialmedia_user_fk")
    await queryInterface.dropTable('SocialMedia');
  }
};