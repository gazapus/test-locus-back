var express = require('express');
var router = express.Router();
var controller  = require('./controller');
const authValidation = require('../../middlewares/authValidation');
const mailer = require('../../middlewares/mailer');

router.get('/signin', controller.sign_in);
router.post('/signup', [authValidation.checkDuplicatedEmail, authValidation.checkDuplicatedUsername, controller.sign_up], mailer.sendConfirmation);
router.put('/confirmation/:id', controller.confirm);
router.get('/check', [authValidation.verifyToken], controller.is_logged);

module.exports = router;