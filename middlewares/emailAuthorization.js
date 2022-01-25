const axios = require("axios");
const API_KEY = process.env.API_KEY;

const emailVerification = async (req, res, next) => {
  try {
    const { email } = req.body;
    const verify = await axios.get(
      `http://apilayer.net/api/check?access_key=${API_KEY}&email=${email}&smtp=1&format=1`
    );
    if (verify.data.mx_found === true && verify.data.smtp_check === true) {
      next();
    } else {
      throw { name: "EmailNotFound" };
    }
  } catch (err) {
    next(err);
  }
};

module.exports = emailVerification;
