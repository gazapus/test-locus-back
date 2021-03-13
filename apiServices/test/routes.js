var express = require('express');
var router = express.Router();
var controller  = require('./controller');
var authValidation = require('../../middlewares/authValidation');

router.get('/get', controller.get_all);
router.get('/get/:id', controller.get_one);
router.get('/user', [authValidation.verifyToken], controller.get_by_user);
router.post('/create/:username', controller.create);
router.delete('/delete/:id', controller.delete_one);
router.delete('/delete', controller.delete_all);

module.exports = router;