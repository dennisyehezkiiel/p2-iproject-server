const { Diary, User, Tag } = require("../models");
const { Op } = require("sequelize");

class DiaryController {
  static async createDiary(req, res, next) {
    try {
      const { title, story, imageUrl, TagId } = req.body;
      const newDiary = await Diary.create({
        title,
        story,
        imageUrl,
        UserId: req.currentUser.id,
        TagId,
      });
      res.status(201).json(newDiary);
    } catch (err) {
      next(err);
    }
  }
  static async getDiary(req, res, next) {
    try {
      const findTitle = req.query.title;
      const findTag = +req.query.tagId;
      let findQuery = {
        order: [["createdAt", "DESC"]],
      };

      if (findTitle) {
        findQuery.where = {
          UserId: req.currentUser.id,
          title: {
            [Op.iLike]: `%${findTitle}%`,
          },
        };
      } else if (findTag) {
        findQuery.where = {
          UserId: req.currentUser.id,
          TagId: {
            [Op.eq]: findTag,
          },
        };
      } else if (findTag && findTitle) {
        findQuery.where = {
          [Op.and]: [
            { UserId: req.currentUser.id },
            {
              [Op.or]: [
                { title: { [Op.iLike]: `%${findTitle}%` } },
                { TagId: { [Op.eq]: findTag } },
              ],
            },
          ],
        };
      } else {
        findQuery.where = {
          UserId: req.currentUser.id,
        };
      }
      const diary = await Diary.findAll(findQuery);
      res.status(200).json(diary);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async updateDiary(req, res, next) {
    try {
      const { title, stroy, imageUrl, TagId } = req.body;
      const diaryId = req.params.id;
      const findDiary = await Diary.findByPk(diaryId);
      if (!findDiary) {
        throw { name: "NotFound" };
      }
      const updateDiary = await Diary.update(
        { title, stroy, imageUrl, TagId },
        { where: { id: diaryId }, returning: true }
      );
      res.status(200).json(updateDiary);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async getTag(req, res, next) {
    try {
      const getAllTag = await Tag.findAll();
      res.status(200).json(getAllTag);
    } catch (err) {
      next(err);
    }
  }
  static async getDiaryById(req, res, next) {
    try {
      const diaryId = req.params.id;
      const getDiary = await Diary.findAll({ where: { id: diaryId } });
      res.status(200).json(getDiary);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
}

module.exports = DiaryController;
