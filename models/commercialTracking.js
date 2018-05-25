/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

const mongoose = require('mongoose'),
	{Schema} = mongoose;

const commercialTrackingSchema = new Schema({
	_id: {type: String, required: true},
	auditor: {type: String, required: true},
	date: {type: String, required: true},
	airline: {type: String, required: true},
	flyNumber: {type: String, required: true},
	passengersCount: {type: String, required: true},
	placeVisited: {type: Number, required: true},
	bought: {type: String, required: true},
	entranceHour: {type: String, required: true},
	departHour: {type: String, required: true},
	totalTime: {type: String, required: true},
	justificationCode: {type: Number},
	justificationText: {type: String}
});

const CommercialTracking = mongoose.model('commercialTracking', commercialTrackingSchema);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = CommercialTracking;