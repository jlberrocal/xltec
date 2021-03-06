/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

const mongoose = require('mongoose'),
	{Schema} = mongoose;

const checkInSchema = new Schema({
	_id: {type: String, required: true},
	auditor: {type: String, required: true},
	date: {type: String, required: true},
	airline: {type: String, required: true},
	flyNumber: {type: String, required: true},
	securityAgents: {type: Number, required: true},
	availablePositions: {type: Number, required: true},
	process: {type: String, required: true, enum: ['F', 'A']},
	attentionSystem: {type: String, required: true, enum: ['S', 'M']},
	passengersCount: {type: String, required: true},
	handLuggage: {type: String, required: true},
	registeredLuggage: {type: String, required: true},
	openedPositions: {type: Number, required: true},
	queueType: {type: String, required: true, enum: ['N', 'E', 'BD']},
	entranceHour: {type: String, required: true},
	departHour: {type: String, required: true},
	totalTime: {type: String, required: true},
	justificationCode: {type: Number},
	justificationText: {type: String}
});

const CheckIn = mongoose.model('checkIn', checkInSchema);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = CheckIn;