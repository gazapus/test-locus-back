var express = require('express');
var router = express.Router();
var controller  = require('./controller');
const mailer = require('../../middlewares/mailer');

router.get('/get', controller.get_all);
router.post('/create', [controller.create, mailer.sendRestartPassword]);
router.put('/confirm/:id', controller.confirm);
router.delete('/delete/:id', controller.delete_one);
router.delete('/delete', controller.delete_all);

module.exports = router;