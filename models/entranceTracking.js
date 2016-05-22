/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var entranceTracking = new Schema({
    auditor: { type: String, required: true },
    date: { type: String, required: true },
    airline: { type: String, required: true },
    flyNumber: { type: String, required: true },
    passengersCount: { type: String, required: true },
    process: { type: Number, required: true, enum: [1, 2, 3, 4] },
    secondRevision: { type: String, required: true, enum: ['S', 'N'] },
    entranceHour: { type: String, required: true },
    departHour: { type: String, required: true },
    totalTime: { type: String, required: true },
    justificationCode: { type: Number },
    justificationText: { type: String }
});

module.exports = mongoose.model('entranceTracking', entranceTracking);