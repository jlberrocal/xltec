/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

const mongoose = require('mongoose'),
	{Schema} = mongoose;

const migrationSchema = new Schema({
	_id: {type: String, required: true},
	auditor: {type: String, required: true},
	date: {type: String, required: true},
	availablePositions: {type: Number, required: true},
	process: {type: String, required: true, enum: ['F', 'A']},
	passengersCount: {type: String, required: true},
	openedPositions: {type: Number, required: true},
	attentionWindow: {type: Number, default: 0},
	entranceHour: {type: String, required: true},
	departHour: {type: String, required: true},
	totalTime: {type: String, required: true},
	justificationCode: {type: Number},
	justificationText: {type: String}
});

const Migration = mongoose.model('migration', migrationSchema);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = Migration;