const diariesRouter = require("express").Router();
const DiaryController = require("../controllers/diaryController");

diariesRouter.get("/getTag", DiaryController.getTag);
diariesRouter.get("/diaries", DiaryController.getDiary); //dapetin diari sesuai dngan userId
diariesRouter.post("/diaries", DiaryController.createDiary); //menambah diari sesuai dengan userId
diariesRouter.get("/diaries/:id", DiaryController.getDiaryById);
diariesRouter.put("/diaries/:id", DiaryController.updateDiary); //update diari sesuai dengan userId
diariesRouter.delete("/diaries:id", (req, res) => {
  res.send("oke");
}); //delete diari sesuai dengan userId (ini harusnya soft delete ya)

module.exports = diariesRouter;
