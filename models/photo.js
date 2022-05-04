'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Photo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as: 'User',
        foreignKey: 'UserId'
      })
      
      this.hasMany(models.Comment, {
        as: "Comments",
        foreignKey: "PhotoId"
      })
    }
  }
  Photo.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    caption: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    poster_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Photo',
    tableName: 'Photo',
    hooks: {
      afterCreate: (record) => {
        delete record.dataValues.createdAt,
        delete record.dataValues.updatedAt
      }
    }
  });
  return Photo;
};