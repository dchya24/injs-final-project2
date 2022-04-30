'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Photo, {
        as: "Photos",
        foreignKey: "UserId"
      })

      this.hasMany(models.Comment, {
        as: "Comments",
        foreignKey: 'UserId'
      })

      this.hasMany(models.SocialMedia, {
        as: "SocialMedias",
        foreignKey: 'UserId'
      })
    }
  }
  User.init({
    full_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type:  DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    username: {
      type:  DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_image_url: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isUrl: true
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    },
    phone_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isNumeric: true
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'User'
  });
  return User;
};