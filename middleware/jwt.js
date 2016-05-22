/**
 * Created by Jose on 20/05/2016.
 */

var jwt     = require('jsonwebtoken'),
    config  = require('../config/params'),
    bodyParser  = require('body-parser'),
    router  = require('express').Router();

router.use(bodyParser.json());
router.use(function (req, resp, next) {
    var token = req.body.token || req.headers['x-auth-token'];
    if(token) {
        jwt.verify(token, config.jwt, function (err, decoded) {
            if(err) return resp.json({ token: null, message: 'Cheaters are not allowed' });
            var token = jwt.sign({
                name: decoded.name,
                username: decoded.username,
                roles: decoded.roles
            }, config.jwt, {
                expiresIn: req.body.rememberMe ? 3600 * 24 * 31 : (req.body.mac ? '24h' : '8h')
            });
            resp.setHeader('x-auth-token', token);
            resp.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
            next();
        });
    } else
        return resp.json({ token: null, message: 'You must provide an access token to access this resource' });
});

module.exports = router;