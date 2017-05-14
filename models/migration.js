/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var migrationSchema = new Schema({
    _id: { type: String, required: true, unique: true, index: true},
    auditor: { type: String, required: true },
    date: { type: String, required: true },
    availablePositions: { type: Number, required: true },
    process: { type: String, required: true, enum: ['F', 'A'] },
    passengersCount: { type: String, required: true },
    openedPositions: { type: Number, required: true },
    attentionWindow: { type: Number, default: 0 },
    entranceHour: { type: String, required: true },
    departHour: { type: String, required: true },
    totalTime: { type: String, required: true },
    justificationCode: { type: Number },
    justificationText: { type: String }
});

const Migration = mongoose.model('migration', migrationSchema);

module.exports = Migration;