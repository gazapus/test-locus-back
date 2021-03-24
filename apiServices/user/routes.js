var express = require('express');
var router = express.Router();
var controller  = require('./controller');
const authValidation = require('../../middlewares/authValidation');
//const mailer = require('../../middlewares/mailer');

//router.get('/get/all', [authValidation.verifyToken, authValidation.verifyAdmin, controller.get_all]);
router.get('/get/all', [controller.get_all]);
router.get('/get/one/:id', [authValidation.verifyToken, authValidation.verifyAdmin, controller.get_one]);
router.get('/check/username/:username', controller.check_username);
router.put('/update/one/mail', [authValidation.verifyToken, controller.update_email ]);
router.put('/update/one/username', [authValidation.verifyToken, controller.update_username]);
router.put('/update/one/password', [authValidation.verifyToken, controller.update_password]);
//router.post('/create', [authValidation.checkDuplicatedEmail, authValidation.checkDuplicatedUsername, controller.create]);
router.delete('/delete', [authValidation.verifyToken, authValidation.verifyAdmin, controller.delete_all]);
router.delete('/delete/:id', [authValidation.verifyToken, authValidation.verifyAdmin, controller.delete_one]);

module.exports = router;