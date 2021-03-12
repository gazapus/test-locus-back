const config = require('config');
const mailer = require('../utils/mailer');
const hostFront = config.get('Customer.front.host');

const mailerConfig = config.get('Customer.transporter');

function confirmationSignUp(id) {
    return `
        <h3>Confirmá tu correo electrónico</h3>
        <p>Para accedera tu cuenta y trabajar con el test de Caras-R confirmé su registro.</p>
        <br/>
        <a href="${hostFront + 'confirmation/' + id}">CONFIRMAR</a>
    `
}

function confirmationOriginalEmailChange(id, newEmail) {
    return `
        <h3>Cambios en tu cuenta</h3>
        <p>
            Se ha seleccionado a ${newEmail} como nueva dirección para su cuenta en CARAS-R.
            <br/>
            Si ha sido usted no hace falta realizar otra acción. De lo contrario siga el siguiente enlace para cancelar este cambio.
            También es necesario que cambie su contraseña para mayor seguridad.
        </p>
        <br/>
        <a href="${hostFront + 'cancel-change/' + id}">REVERTIR CAMBIO</a>
    `
}

function confirmationNewEmailChange(id, newEmail) {
    return `
        <h3>Se ha vinculado esta dirección a una cuenta en CARAS-R</h3>
        <p>
            Se ha seleccionado esta cuenta - ${newEmail} - como nueva dirección para una cuenta en CARAS-R.
            <br/>
            Para confirmar y hacer efectivo este cambio siga el siguiente link.
        </p>
        <br/>
        <a href="${hostFront + 'confirm-change/' + id}">CONFIRMAR</a>
    `
}

let sendConfirmation = function (req, res) {
    let mailOptions = {
        from: `"Caras-R" <${mailerConfig.remitent}>`,
        to: req.body.email,
        subject: 'Conformación de registro',
        html: confirmationSignUp(req.body.id)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            return res.status(200).send({ message: 'Se ha enviado un mail para confirmar su correo electrónico' });
        })
        .catch(err => {
            console.log(console.error(err));
            return res.status(500).send({ message: 'Se ha producido un error al enviar el email de confirmación' });
        })
}

let sendEmailChangeToOriginal = function (req, res, next) {
    let mailOptions = {
        from: `"Caras-R" <${mailerConfig.remitent}>`,
        to: req.body.originalEmail,
        subject: 'Cambio de dirección de correo electronico',
        html: confirmationOriginalEmailChange(req.body.request_id, req.body.newEmail)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            console.log('Se ha enviado un mail de aviso sobre este cambio a su correo original');
            next();
        })
        .catch(err => {
            return res.status(500).send({ message: 'Se ha producido un error al enviar el email de aviso' });
        })
}

let sendEmailChangeToNew = function (req, res) {
    let mailOptions = {
        from: `"Caras-R" <${mailerConfig.remitent}>`,
        to: req.body.newEmail,
        subject: 'Se ha vinculado esta dirección en CARAS-R',
        html: confirmationNewEmailChange(req.body.request_id, req.body.newEmail)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            return res.status(200).send({ message: 'Se ha enviado un mail de aviso a la nueva dirección' });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Se ha producido un error al enviar el email de aviso' });
        })
}

const mailerFunctions = {
    sendConfirmation,
    sendEmailChangeToOriginal,
    sendEmailChangeToNew
};

module.exports = mailerFunctions