const userRouter = require("express").Router();
const userController = require("../controllers/userController");
const authentication = require("../middlewares/authentication");
const mutualAuthorization = require("../middlewares/authorization");

userRouter.post("/register", userController.postRegister); //register user
userRouter.post("/login", userController.login); //login user
userRouter.use(authentication);
userRouter.get("/notification/:userId", userController.notification); //tampilin notifikasi khusus untuk user dengan id = userId
userRouter.get("/profileDetail/:userId", userController.profileDetail); //tampilin profile user dengan id = userId
userRouter.post("/addMutual/:mutualId", userController.postMutual); //mengadd atau tambah teman baru, mutualId itu id dari teman yang mau dijadikan mutual
userRouter.use(mutualAuthorization);
userRouter.patch("/confirmMutual/:mutualId", userController.confirmMutual); //mengubah status dari "Requested" menjadi Mutuals, menerima pertemanan

module.exports = userRouter;
