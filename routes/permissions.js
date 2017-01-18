/**
 * Created by Jose on 11/05/2016.
 */
'use strict';

var router = require('express').Router(),
    bodyParser = require('body-parser'),
    Permissions = require('../models/permissions'),
    User = require('../models/users'),
    moment = require('moment');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.route('/').get(function (req, resp) {
    Permissions.find().populate({
        path: 'users',
        select: '-password -allowedDevices -roles -username -permissions -__v'
    }).exec().then(function (result) {
        if (!result || result.length === 0) return resp.status(404).json({ message: "permissions table is empty" });
        return resp.json(result);
    }, function (err) {
        return resp.status(500).json(err);
    });
}).post(function (req, resp) {
    if (!req.body.from || !req.body.until) resp.status(415).json({ message: "Missed required arguments" });
    req.body.from = moment(req.body.from, 'DD-MM-YYYY').format();
    req.body.until = moment(req.body.until, 'DD-MM-YYYY').format();

    var permission = new Permissions(req.body);
    permission.save().then(function () {
        return resp.json({ message: "Permission created successfully" });
    }, function (err) {
        return resp.status(415).json(err);
    });
}).delete(function (req, resp) {
    Permissions.remove().then(function () {
        return resp.json({ message: "All permissions were deleted" });
    }, function (err) {
        return resp.status(500).json(err);
    });
});

router.route('/:id').get(function (req, resp) {
    Permissions.findById(req.params.id).populate({
        path: 'User',
        select: '-password -allowedDevices -roles -username -__v'
    }).exec().then(function (result) {
        if (!result) return resp.status(404).json({ message: "permissions table is empty" });
        return resp.json(result);
    }, function (err) {
        return resp.status(500).json(err);
    });
}).put(function (req, resp) {
    Permissions.findById(req.params.id).then(function (permission) {
        if (!permission) return resp.status(404).json({ message: "Permission not found" });
        if (req.body.from) permission.from = moment(req.body.from).format();
        if (req.body.until) permission.until = moment(req.body.until).format();
        if (req.body.users) permission.users = req.body.users;
        permission.save().then(function () {
            return resp.json({ message: "Permission updated successfully" });
        }, function (err) {
            return resp.status(415).json(err);
        });
    }, function (err) {
        return resp.status(415).json(err);
    });
}).delete(function (req, resp) {
    Permissions.remove({ _id: req.params.id }).exec().then(function () {
        return resp.json({ message: "Permission deleted successfully" });
    }, function (err) {
        return resp.status(415).json(err);
    });
});

module.exports = router;