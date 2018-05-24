/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var taxesSchema = new Schema({
    _id: { type: String, required: true },
    auditor: { type: String, required: true },
    date: { type: String, required: true },
    availablePositions: { type: Number, required: true },
    process: { type: String, required: true, enum: ['F', 'A'] },
    passengersCount: { type: String, required: true },
    openedPositions: { type: Number, required: true },
    entranceHour: { type: String, required: true },
    departHour: { type: String, required: true },
    totalTime: { type: String, required: true },
    justificationCode: { type: Number },
    justificationText: { type: String }
});

const Taxes = mongoose.model('taxes', taxesSchema);

module.exports = Taxes;