/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

var router = require('express').Router(),
    bodyParser = require('body-parser'),
    Devices = require('../models/devices');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.route('/').get(function (req, resp) {
    Devices.find().populate({
        path: 'linkedUsers',
        select: '-password -__v -allowedDevices -roles -username'
    }).exec().then(function (devices) {
        if (devices.length > 0) return resp.json(devices);
        resp.json({ message: "There is no devices registered" });
    }, function (err) {
        return resp.json(err).status(500);
    });
}).post(function (req, resp) {
    var device = new Devices(req.body);
    device.save().then(function () {
        return resp.json({ message: "Device stored successfully" });
    }, function (err) {
        return resp.status(500).json(err);
    });
});

router.route('/:id').get(function (req, resp) {
    Devices.findById(req.params.id).then(function (device) {
        if (device) return resp.json(device);
        resp.json({ message: "Device not found" });
    }, function (err) {
        return resp.json(err).status(500);
    });
}).put(function (req, resp) {
    Devices.findById(req.params.id).then(function (device) {
        if (!device) return resp.json({ message: "Device not found" });
        if (req.body.name) device.name = req.body.name;
        if (req.body.mac) device.mac = req.body.mac;
        if (req.body.users) device.linkedUsers = req.body.users;
        device.save().then(function () {
            return resp.json({ message: "Device updated successfully" });
        }, function (err) {
            return resp.status(500).json(err);
        });
    }, function (err) {
        return resp.status(500).json(err);
    });
}).delete(function (req, resp) {
    Devices.remove({ id: req.params.id }).then(function () {
        return resp.json({ message: "Device removed successfully" });
    }, function (err) {
        return resp.json(err).status(500);
    });
});

module.exports = router;