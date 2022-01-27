"use strict";
const { Model } = require("sequelize");
const { createHash } = require("../helpers/bcrypt");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Diary, { foreignKey: "UserId" });
      User.hasMany(models.Mutual, { foreignKey: "firstUser" });
      User.hasMany(models.Mutual, { foreignKey: "secondUser" });
      User.hasMany(models.Notification, { foreignKey: "userFrom" });
      User.hasMany(models.Notification, { foreignKey: "userId" });
      User.belongsToMany(models.UserStatus, { through: models.Message });
    }
  }
  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
        },
      },
      username: {
        type: DataTypes.STRING,
        unique: { args: true, msg: "Username is already used" },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Username is required",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          len: {
            args: [5],
            msg: "Password minimum length is 5",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: { args: true, msg: "Email is already used" },
        allowNull: false,
        validate: {
          notNull: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Email form is incorrect",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Phone number is required",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  User.beforeCreate((user, option) => {
    const newPassword = createHash(user.password);
    user.password = newPassword;
  });
  return User;
};
