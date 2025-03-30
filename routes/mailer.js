// mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: 'rezme03@gmail.com',
    pass: 'cyncjvlfscmakpih' 
  }
});

module.exports = transporter;