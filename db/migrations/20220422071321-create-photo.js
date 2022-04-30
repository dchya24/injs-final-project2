'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Photo', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      caption: {
        type: Sequelize.TEXT
      },
      poster_image_url: {
        type: Sequelize.TEXT
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()")
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()")
      }
    })
    .then(() => {
      queryInterface.addConstraint('Photo',{
        fields: ['UserId'],
        type: "foreign key",
        name: "photos_user_fk",
        references: {
          table: 'User',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Photo", "photos_user_fk")
    await queryInterface.dropTable('Photo');
  }
};