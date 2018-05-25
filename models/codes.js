/**
 * Created by Jose on 01/05/2016.
 */
/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

const mongoose = require('mongoose'),
	{Schema} = mongoose;

const codes = new Schema({
	code: {type: String, required: true, index: {unique: true}},
	observation: {type: String, default: ' '},
	process: {type: String, required: true}
});

const Codes = mongoose.model('Code', codes);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = Codes;