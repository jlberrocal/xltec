/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

var router = require('express').Router(),
    bodyParser = require('body-parser'),
    Codes = require('../models/codes');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.route('/').get(function (req, resp) {
    Codes.find().sort({ code: 'asc' }).exec().then(function (codes) {
        if (codes.length > 0) return resp.json(codes);
        resp.json({ message: "There is no justification codes" });
    }, function (err) {
        return resp.json(err).status(500);
    });
}).post(function (req, resp) {
    var code = new Codes(req.body);
    code.save().then(function () {
        return resp.json({ message: "Code stored successfully" });
    }, function (err) {
        return resp.json(err);
    });
});

router.route('/:id').put(function (req, resp) {
    Codes.findById(req.params.id).then(function (code) {
        if (!code) return resp.json({ message: "Code not found" });
        if (req.body.code) code.code = req.body.code;
        if (req.body.observation) code.observation = req.body.observation;
        if (req.body.process) code.process = req.body.process;
        code.save().then(function () {
            return resp.json({ message: "Code updated successfully" });
        }, function (err) {
            return resp.json(err).status(500);
        });
    }, function (err) {
        return resp.json(err).status(500);
    });
}).delete(function (req, resp) {
    Codes.findById(req.params.id).then(function (code) {
        if (!code) return resp.status(404).json({ message: "Code not found" });
        code.remove().then(function (done) {
            return resp.json({ message: "Code deleted successfully" });
        }, function (err) {
            return resp.status(500).json(err);
        });
    }, function (err) {
        return resp.status(500).json(err);
    });
});

router.route('/process/:process').get(function (req, resp) {
    Codes.find({ process: req.params.process }).then(function (codes) {
        if (codes.length > 0) return resp.json(codes);
        resp.json({ message: "There is no codes for the required process" }).status(401);
    }, function (err) {
        return resp.json(err).status(500);
    });
});

module.exports = router;