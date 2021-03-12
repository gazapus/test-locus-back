var express = require('express');
var router = express.Router();
var controller  = require('./controller');

router.get('/get', controller.get_all);
router.get('/get/:id', controller.get_one);
router.post('/create', controller.create);
router.delete('/delete/:id', controller.delete_one);
router.delete('/delete', controller.delete_all);

module.exports = router;