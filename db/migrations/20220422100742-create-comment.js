'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Comment', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      PhotoId: {
        type: Sequelize.INTEGER
      },
      comment: {
        type: Sequelize.TEXT
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
      return queryInterface.addConstraint('Comment',{
        fields: ['UserId'],
        type: "foreign key",
        name: "comment_user_fk",
        references: {
          table: 'User',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    })
    .then(() => {
      queryInterface.addConstraint('Comment',{
        fields: ['PhotoId'],
        type: "foreign key",
        name: "comment_photo_fk",
        references: {
          table: 'Photo',
          field: 'id'
        },
        onDelete: 'cascade',
        onUpdate: 'cascade'
      });
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("Comment", "comment_photo_fk");
    await queryInterface.dropTable('Comment');
  }
};