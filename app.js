require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const port = 3000;
const router = require("./routes/index");
const errorHandler = require("./middlewares/errorHandler");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", router);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
