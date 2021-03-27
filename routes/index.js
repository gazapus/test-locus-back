const express = require('express');
const users = require('../apiServices/user/routes');
const test = require('../apiServices/test/routes');
const auth = require('../apiServices/auth/routes');
const changeRequest = require('../apiServices/changeRequest/routes');
const changePasswordRequest = require('../apiServices/changePasswordRequest/routes');

const router = express.Router();

router.use('/user', users);
router.use('/test', test);
router.use('/auth', auth);
router.use('/changerequest', changeRequest);
router.use('/changepasswordrequest', changePasswordRequest);

module.exports = router;