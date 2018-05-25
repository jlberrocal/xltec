/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

const express = require('express'),
    router = express.Router({
        mergeParams: true
    }),
    Codes = require('../models/codes');

router.route('/')
    .get(async (req, resp) => {
        try {
            const codes = await Codes.find().sort({code: 'asc'}).exec();
            resp.send(codes.length > 0 ? codes : {message: "There is no justification codes"})
        } catch (e) {
            return resp.json(e).status(500);
        }
    })
    .post((req, resp) => {
        const code = new Codes(req.body);

        code.save()
            .then(() => resp.json({message: "Code stored successfully"}))
            .catch(err => resp.json(err).status(500));
    });

router.route('/:id')
    .put(async (req, resp) => {
        let {id} = req.params;
        let savedCode = await Codes.findById(id).exec();
        let {code, observation, process} = req.body;

        if (!savedCode) {
            return resp.json({message: "Code not found"});
        }

        savedCode.code = code;
        savedCode.observation = observation;
        savedCode.process = process;

        code.save()
            .then(() => resp.json({message: "Code updated successfully"}))
            .catch((err) => resp.json(err).status(500));
    })
    .delete(async (req, resp) => {
        const code = await Codes.findById(req.params.id).exec();

        if (!code) {
            return resp.status(404).json({message: "Code not found"});
        }

        code.remove()
            .then(() => resp.json({message: "Code deleted successfully"}))
            .catch(err => resp.status(500).json(err));
    });

router.route('/process/:process')
    .get((req, resp) => {
        Codes.find({process: req.params.process}).then(function (codes) {
            if (codes.length > 0) return resp.json(codes);
            resp.json({message: "There is no codes for the required process"}).status(401);
        }, function (err) {
            return resp.json(err).status(500);
        });
    });

router.route('by-process/:process')
    .get(async (req, resp) => {
        let {process} = req.params;
        const codes = await Codes.find({process}).exec();

        if (codes) {
            resp.json(codes);
        } else {
            resp.json({message: `${process} has no codes associated`}).status(404);
        }
    });

module.exports = router;