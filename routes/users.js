/**
 * Created by Jose on 27/04/2016.
 */
'use strict';

var router = require('express').Router(),
    bodyParser = require('body-parser'),
    Users = require('../models/users'),
    Devices = require('../models/devices'),
    Permissions = require('../models/permissions');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.route('/').get(function (req, resp) {
    Users.find().select('-_id name username roles allowedDevices').populate({
        path: 'allowedDevices',
        select: '-__v'
    }).exec().then(function (user) {
        if (user) return resp.json(user);
        resp.json({ message: "There is no users at this moment" });
    }, function (err) {
        return resp.json(err).status(500);
    });
}).post(function (req, resp) {
    if (req.body) {
        var User = new Users(req.body);
        User.save().then(function () {
            return resp.json({ message: "User saved successfully" });
        }, function (err) {
            return resp.json(err);
        });
    }
});

router.route('/:username').get(function (req, resp) {
    Users.findOne({ username: req.params.username }).then(function (user) {
        if (user) return resp.json({
            id: user._id,
            username: user.username,
            name: user.name,
            allowedDevices: user.allowedDevices,
            roles: user.roles
        });
        resp.json({ error: "User not found" }).status(500);
    }, function (err) {
        return resp.json(err);
    });
}).put(function (req, resp) {
    Users.findOne({ username: req.params.username }).then(function (user) {
        if (user && req.body) {
            var body = req.body;
            if (body.username) user.username = body.username;
            if (body.name) user.name = body.name;
            if (body.password) {
                user.comparePassword(body.password).then(function () {
                    return user.password = body.password;
                }, function (err) {
                    return resp.json(err);
                });
            }
            if (body.roles) user.roles = body.roles;
            if (body.allowedDevices) {
                user.allowedDevices = body.allowedDevices;
                body.allowedDevices.forEach(function (device) {
                    Devices.findById(device).then(function (item) {
                        item.linkedUsers.push(user._id);
                        item.save().exec();
                    });
                });
            }
            if (body.permissions) {
                body.permissions.forEach(function (permission) {
                    Permissions.findById(permission).then(function (item) {
                        item.users.push(user._id);
                        item.save.exec();
                    });
                });
            }

            user.save().then(function () {
                return resp.json({ message: "User updated successfully" });
            }, function (err) {
                return resp.status(500).json(err);
            });
        } else return resp.json({ message: "user not found" }).status(500);
    }, function (err) {
        return resp.json(err);
    });
}).delete(function (req, resp) {
    Users.remove({ username: req.params.username }).exec().then(function () {
        return resp.json({ message: 'user deleted successfully' });
    }, function (err) {
        return resp.json(err);
    });
}).patch(function (req, resp) {
    Users.findOne({ username: req.params.username }).then(function (user) {
        if (!user) return resp.status(404).json({ message: "user not found" });
        user.comparePassword(req.body.old).then(function () {
            user.password = req.body.new;
            return user.save().then(function () {
                return resp.json({ message: "Password changed successfully" });
            }, function (err) {
                return resp.json(err);
            });
        }, function () {
            return resp.status(400).json({ message: "Contraseña incorrecta" });
        });
    }, function (err) {
        return resp.status(404).json(err);
    });
});
router.route('/auditors/json').get(function (req, resp) {
    Users.find({ roles: { $in: ['audit'] } }).then(function (result) {
        return resp.json(result);
    }, function (err) {
        return resp.error(err);
    });
});

module.exports = router;