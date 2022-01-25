"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mutual extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Mutual.belongsTo(models.User, { foreignKey: "firstUser", as: "user1" });
      Mutual.belongsTo(models.User, { foreignKey: "secondUser", as: "user2" });
    }
  }
  Mutual.init(
    {
      firstUser: DataTypes.INTEGER,
      secondUser: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Mutual",
    }
  );
  return Mutual;
};
