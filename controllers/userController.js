const { User, Mutual, Notification } = require("../models");
const { createToken } = require("../helpers/jwt");
const { compareHash } = require("../helpers/bcrypt");
const { Op } = require("sequelize");

class UserController {
  static async postRegister(req, res, next) {
    try {
      const { name, username, password, email, phoneNumber } = req.body;
      const newRegister = await User.create({
        name,
        username,
        password,
        email,
        phoneNumber,
      });
      res
        .status(201)
        .json({ msg: `User with id ${newRegister.id} successfully created` });
    } catch (err) {
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { password, email } = req.body;
      const login = await User.findOne({ where: { email } });
      if (!login) {
        throw { name: "InvalidUserNameOrPassword" };
      }
      if (!compareHash(password, login.password)) {
        throw { name: "InvalidUserNameOrPassword" };
      }
      const payload = {
        id: login.id,
      };
      const accessToken = createToken(payload);
      res.status(200).json({ access_token: accessToken });
    } catch (err) {
      next(err);
    }
  }
  static async profileDetail(req, res, next) {
    try {
      const userId = req.params.userId;
      const findUser = await User.findByPk(userId, {
        attributes: { exclude: ["password", "updatedAt"] },
      });
      if (!findUser) {
        throw { name: "UserNotFound" };
      }
      res.status(200).json(findUser);
    } catch (err) {
      next(err);
    }
  }
  static async postMutual(req, res, next) {
    try {
      const mutualId = req.params.mutualId;
      const findMutual = await User.findByPk(mutualId);
      if (!findMutual) {
        throw { name: "UserNotFound" };
      }
      const addMutual = await Mutual.create({
        firstUser: req.currentUser.id,
        secondUser: mutualId,
        status: "Requested",
      });
      await Notification.create({
        message: `${req.currentUser.username} send you a friend request`,
        userFrom: req.currentUser.id,
        userId: mutualId,
      });
      res.status(201).json(addMutual);
    } catch (err) {
      next(err);
    }
  }
  static async confirmMutual(req, res, next) {
    try {
      const mutualId = req.params.mutualId;
      const findMutual = await User.findByPk(mutualId);
      if (!findMutual) {
        throw { name: "UserNotFound" };
      }
      const changeStatus = { status: "Mutuals" };
      await Mutual.update(changeStatus, {
        where: { secondUser: req.currentUser.id },
      });
      await Notification.create({
        message: `${req.currentUser.username} accept your friend request`,
        userFrom: req.currentUser.id,
        userId: mutualId,
      });
      res.status(200).json({ message: `Friend request confirmed` });
    } catch (err) {
      next(err);
    }
  }
  static async notification(req, res, next) {
    try {
      const id = req.params.userId;
      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw { name: "UserNotFound" };
      }
      const findNotification = await Notification.findAll({
        where: { userId: id },
      });
      res.status(200).json(findNotification);
    } catch (err) {
      next(err);
    }
  }
  static async getMutualList(req, res, next) {
    try {
      const id = req.params.userId;
      const findUser = await User.findByPk(id);
      if (!findUser) {
        throw { name: "UserNotFound" };
      }
      const mutualList = await Mutual.findAll({
        where: {
          [Op.and]: [
            { status: "Mutuals" },
            { [Op.or]: [{ firstUser: id }, { secondUser: id }] },
          ],
        },
        include: {
          model: User,
        },
      });
      res.status(200).json(mutualList);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = UserController;
