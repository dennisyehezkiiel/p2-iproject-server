const axios = require("axios");
const API_KEY = process.env.API_KEY;
const PHONE_KEY = process.env.PHONE_KEY;

const registAuthorization = async (req, res, next) => {
  try {
    const { email, phoneNumber } = req.body;
    const verify = await axios.get(
      `http://apilayer.net/api/check?access_key=${API_KEY}&email=${email}&smtp=1&format=1`
    );
    const verifyPhoneNumber = await axios.get(
      `https://phonevalidation.abstractapi.com/v1/?api_key=${PHONE_KEY}&phone=${phoneNumber}`
    );
    if (verifyPhoneNumber.data.valid === false) {
      throw { name: "PhoneNotFound" };
    }
    if (verify.data.mx_found !== true && verify.data.smtp_check !== true) {
      throw { name: "EmailNotFound" };
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = registAuthorization;
