const express = require('express');
const router = express.Router();

router.get(
    '/profile',
    (req, res, next) => {
        res.send({
            message: 'You made it to the secure route',
            user: req.user,
            token: req.query.secret_token
        })
    }
);

module.exports = router;