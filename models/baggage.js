/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var baggage = new Schema({
    auditor: { type: String, required: true },
    date: { type: String, required: true },
    airline: { type: String, required: true },
    flyNumber: { type: String, required: true },
    airplaneType: { type: String, required: true },
    lastLuggageTakenBy: { type: String, required: true, enum: ['G', 'P'] },
    passengersCount: { type: String, required: true },
    luggageCount: { type: String, required: true },
    firstLuggageIn: { type: String, required: true },
    lastLuggageInBand: { type: String, required: true },
    lastLuggageTaken: { type: String, required: true },
    totalTime: { type: String, required: true },
    justificationCode: [Number],
    justificationText: [String]
});

module.exports = mongoose.model('baggage', baggage);
