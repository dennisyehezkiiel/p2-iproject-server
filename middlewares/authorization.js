const { Mutual } = require("../models");
const { Op } = require("sequelize");

const mutualAuthorization = async (req, res, next) => {
  try {
    const findMutual = await Mutual.findAll({
      where: {
        status: "Mutuals",
        [Op.and]: [
          { firstUser: req.params.mutualId },
          { secondUser: req.currentUser.id },
        ],
      },
    });
    const findMutual2 = await Mutual.findAll({
      where: {
        status: "Requested",
        [Op.and]: [
          { firstUser: +req.params.mutualId },
          { secondUser: req.currentUser.id },
        ],
      },
    });
    if (findMutual2.length === 0) {
      throw { name: "AccessDenied" };
    }
    if (req.currentUser.id === req.params.mutualId) {
      throw { name: "AccessDenied" };
    }
    if (findMutual.length !== 0) {
      throw { name: "AccessDenied" };
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = mutualAuthorization;
