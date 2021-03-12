const config = require('config');

const mailerConfig = config.get('Customer.transporter');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: mailerConfig.host,
    port: mailerConfig.port,
    secure: false,
    auth: {
        user: mailerConfig.user,
        pass: mailerConfig.password,
    }
});

const mailer = {
    transporter
}

module.exports = mailer;