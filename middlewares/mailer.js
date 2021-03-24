const config = require('config');
const mailer = require('../utils/mailer');
const hostFront = config.get('Customer.front.host');
const mailerConfig = config.get('Customer.transporter');

function confirmationSignUp(id) {
    return `
        <h3>Confirmá tu correo electrónico</h3>
        <p>Para accedera tu cuenta y trabajar con el test de Locus de Control confirmé su registro.</p>
        <br/>
        <a href="${hostFront + 'confirmation/' + id}">CONFIRMAR</a>
    `
}

function confirmationOriginalEmailChange(id, newEmail) {
    return `
        <h3>Cambios en tu cuenta</h3>
        <p>
            Se ha seleccionado a ${newEmail} como nueva dirección para su cuenta en Locus de Control
            <br/>
            Para confirmar y hacer efectivo este cambio debe seguir el enlace enviado a su nueva dirección de correo electrónico.
            <br/>
            Para cancelar este cambio siga el enlace adjunto. Además es recomendable que cambie su contraseña para mayor seguridad.
        </p>
        <br/>
        <a href="${hostFront + 'cancel-change/' + id}">REVERTIR CAMBIO</a>
    `
}

function confirmationNewEmailChange(id, newEmail) {
    return `
        <h3>Se ha vinculado esta dirección a una cuenta en Locus de Control</h3>
        <p>
            Se ha seleccionado esta cuenta - ${newEmail} - como nueva dirección para una cuenta en Locus de Control.
            <br/>
            Para confirmar y hacer efectivo este cambio siga el siguiente link.
        </p>
        <br/>
        <a href="${hostFront + 'confirm-change/' + id}">CONFIRMAR</a>
    `
}

function confirmationSuccessfull(username, email) {
    return `
        <h3>Se ha confirmado su cuenta en la web del Test Locus de Control</h3>
        <ul>
            <li>Su email: ${email}</li>
            <li>Su usuario: ${username}</li>
            <li>Su enlace del test: ${hostFront}/test/start/${username}</li>
        </ul>
        <p>Ahora ya puede iniciar sesión con su correo electrónico y contraseña</p>
        <br/>
        <a href="${hostFront + 'login'}">INICIAR SESIÓN</a>
    `
}

function confirmationChange(email) {
    return `
        <h3>Se ha confirmado el cambio de correo electrónico en su cuenta</h3>
        <ul>
            <li>Su nueva dirección es: ${email}</li>
        </ul>
        <p>Ahora ya puede iniciar sesión con su nuevo correo electrónico</p>
        <br/>
        <a href="${hostFront + 'login'}">INICIAR SESIÓN</a>
    `
}

function cancelationChange(email) {
    return `
        <h3>Se ha cancelado el cambio de correo electrónico en su cuenta</h3>
        <ul>
            <li>Su dirección es: ${email}</li>
        </ul>
        <p>Ahora ya puede iniciar sesión con su original correo electrónico</p>
        <br/>
        <a href="${hostFront + 'login'}">INICIAR SESIÓN</a>
    `
}

let sendConfirmation = function (req, res) {
    let mailOptions = {
        from: `"Locus de Control" <${mailerConfig.remitent}>`,
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
        from: `"Locus de Control" <${mailerConfig.remitent}>`,
        to: res.locals.originalEmail,
        subject: 'Cambio de dirección de correo electronico',
        html: confirmationOriginalEmailChange(res.locals.request_id, req.body.email)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            console.log('Se ha enviado un mail de aviso sobre este cambio al correo original');
            next();
        })
        .catch(err => {
            return res.status(500).send({ message: 'Se ha producido un error al enviar el email de aviso' });
        })
}

let sendEmailChangeToNew = function (req, res) {
    let mailOptions = {
        from: `"Locus de Control" <${mailerConfig.remitent}>`,
        to: req.body.email,
        subject: 'Se ha vinculado esta dirección en Locus de Control',
        html: confirmationNewEmailChange(res.locals.request_id, req.body.email)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            return res.status(200).send({ message: 'Se ha enviado un mail de aviso a la nueva dirección' });
        })
        .catch(err => {
            return res.status(500).send({ message: 'Se ha producido un error al enviar el email de aviso' });
        })
}

let sendEmailConfirmated = function (req, res) {
    let mailOptions = {
        from: `"Locus de Control" <${mailerConfig.remitent}>`,
        to:  res.locals.email,
        subject: 'Confirmación de cuenta exitosa',
        html: confirmationSuccessfull(res.locals.username, res.locals.email)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            return res.status(200).send({ message: 'Se ha enviado un mail de aviso de confirmación' });
        })
        .catch(err => {
            return res.status(500).send({ message: err.message || 'Se ha producido un error al enviar el email de confirmación' });
        })
}

let sendConfirmationChange = function (req, res) {
    let mailOptions = {
        from: `"Locus de Control" <${mailerConfig.remitent}>`,
        to: res.locals.email,
        subject: 'Conformación de cambio de correo electrónico',
        html: confirmationChange(res.locals.email)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            return res.status(200).send({ message: 'Se ha enviado un mail para confirmar su cambio de correo electrónico' });
        })
        .catch(err => {
            console.log(console.error(err));
            return res.status(500).send({ message: 'Se ha producido un error al enviar el email' });
        })
}

let sendCancelationChange = function (req, res) {
    let mailOptions = {
        from: `"Locus de Control" <${mailerConfig.remitent}>`,
        to: res.locals.email,
        subject: 'Cancelación de cambio de correo electrónico',
        html: cancelationChange(res.locals.email)
    };
    mailer.transporter.sendMail(mailOptions)
        .then(response => {
            return res.status(200).send({ message: 'Se ha enviado un mail para cancelar su cambio de correo electrónico' });
        })
        .catch(err => {
            console.log(console.error(err));
            return res.status(500).send({ message: 'Se ha producido un error al enviar el email' });
        })
}

const mailerFunctions = {
    sendConfirmation,
    sendEmailChangeToOriginal,
    sendEmailChangeToNew,
    sendEmailConfirmated,
    sendConfirmationChange,
    sendCancelationChange
};

module.exports = mailerFunctions