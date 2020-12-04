/*
    path: /api/login
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateFields } = require('../middlewares/validate-fields');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.post('/',[
    check('email','The email is mandatory').isEmail(),
    check('password','The password is mandatory with min length 8').isLength({min: 8}),
    validateFields
], loginUser);

router.post('/new', [
    check('name','The name is mandatory').not().isEmpty(),
    check('email','The email is mandatory').isEmail(),
    check('password','The password is mandatory with min length 8').isLength({min: 8}),
    validateFields
], createUser);

router.get('/renew',
validateJWT,
renewToken);

module.exports = router;