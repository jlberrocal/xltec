/**
 * Created by Jose on 20/05/2016.
 */

var jwt     = require('jsonwebtoken'),
    config  = require('../config/params'),
    bodyParser  = require('body-parser'),
    router  = require('express').Router();

router.use(bodyParser.json({limit: 1024*1024*50}));
router.use(function (req, resp, next) {
    if(req.url.indexOf('xlsx') !== -1) return next();
    var token = req.headers['x-auth-token'] || req.body.token;
    if(token) {
        jwt.verify(token, config.jwt, function (err, decoded) {
            if(err) return resp.status(403).json({ token: null, message: 'Cheaters are not allowed' });
            var token = jwt.sign({
                name: decoded.name,
                username: decoded.username,
                roles: decoded.roles
            }, config.jwt, {
                expiresIn: '8h'
            });
            resp.setHeader('x-auth-token', token);
            resp.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
            next();
        });
    } else
        return resp.status(403).json({message: 'You must provide an access token to access this resource' });
});

module.exports = router;
