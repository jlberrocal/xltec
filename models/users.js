/**
 * Created by Jose on 27/04/2016.
 */
'use strict';

const mongoose = require('mongoose'),
	bcrypt = require('bcrypt'),
	SALT_WORK_FACTOR = 10;
const {Schema} = mongoose;

const user = new Schema({
	name: {type: String, required: "The name is a required value"},
	username: {type: String, required: "The username is  a required value", index: {unique: true}},
	password: {type: String, required: "The password is a required value"},
	roles: {type: Array, required: "You must provide at least one role"},
	allowedDevices: [{type: Schema.Types.ObjectId, ref: 'Device'}],
	permissions: [{type: Schema.Types.ObjectId, ref: 'Permission'}]
});

/**
 * Compare a plain password with hashed equivalent
 * @param {string} password
 * @returns {Promise<boolean>}
 */
function comparePassword(password) {
	let _user = this;
	console.log(_user);

	return bcrypt.compare(password, _user.password)
}

/**
 * Middleware before saving a user model
 * @param next
 * @returns {Promise<*>}
 */
async function preSave(next) {
	let user = this;

	if(!user.isModified('password'))
		return next();

	let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
	user.password = await bcrypt.hash(user.password, salt);

	next();
}

user.pre('save', preSave);
user.methods.comparePassword = comparePassword;

const User = mongoose.model('User', user);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = User;