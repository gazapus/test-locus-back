var express = require('express');
var router = express.Router();
var controller  = require('./controller');
const authValidation = require('../../middlewares/authValidation');
const mailer = require('../../middlewares/mailer');

router.get('/get', controller.get_all);
router.post('/create', [
    authValidation.verifyToken, 
    authValidation.checkDuplicatedEmail, 
    controller.create, 
    mailer.sendEmailChangeToOriginal, 
    mailer.sendEmailChangeToNew
]);
router.put('/confirm/:id', controller.confirm);
router.put('/cancel/:id', controller.cancel);
router.delete('/delete/:id', controller.delete_one);
router.delete('/delete', controller.delete_all);

module.exports = router;