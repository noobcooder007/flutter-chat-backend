/*
    path: /api/messages
*/

const { Router } = require('express');
const { getChat } = require('../controllers/messages');
const { validateJWT } = require('../middlewares/validate-jwt');

const router = Router();

router.get('/:of',
validateJWT,
getChat);

module.exports = router;