/**
 * Created by Jose on 24/05/2018.
 */
'use strict';

const mongoose = require('mongoose');
const {Schema} = mongoose;

const activitySchema = new Schema({
	auditor: {type: String, required: true},
	date: {type: Date, required: true},
	success: {type: Boolean, required: true, default: false},
	device: {type: String, required: true}
});

const Activity = mongoose.model('activity', activitySchema);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = Activity;