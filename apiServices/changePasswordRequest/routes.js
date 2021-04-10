var express = require('express');
var router = express.Router();
var controller  = require('./controller');
const mailer = require('../../middlewares/mailer');
const authValidation = require('../../middlewares/authValidation');

router.get('/get', [authValidation.verifyAdmin], controller.get_all);
router.post('/create', [controller.create, mailer.sendRestartPassword]);
router.put('/confirm/:id', controller.confirm);
router.delete('/delete/:id', [authValidation.verifyAdmin], controller.delete_one);
router.delete('/delete', [authValidation.verifyAdmin], controller.delete_all);

module.exports = router;