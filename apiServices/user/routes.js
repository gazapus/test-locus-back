var express = require('express');
var router = express.Router();
var controller  = require('./controller');
const authValidation = require('../../middlewares/authValidation');

router.get('/get', controller.get_all);
router.get('/get/:id', controller.get_one);
router.post('/create', [authValidation.checkDuplicatedEmail], controller.create);
router.delete('/delete', controller.delete_all);
router.delete('/delete/:id', controller.delete_one);

module.exports = router;