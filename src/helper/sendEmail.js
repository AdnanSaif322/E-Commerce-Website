const createError = require('http-errors');
const emailWithNodemailer = require('./email');

const sendEmail = async (emailData) =>{
    try {
        await emailWithNodemailer(emailData);
      } catch (emailError) {
        throw createError(500, "Failed to send verification Email");
      }
};

module.exports = sendEmail;