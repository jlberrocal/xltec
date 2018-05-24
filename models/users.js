/**
 * Created by Jose on 27/04/2016.
 */
'use strict';

const mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
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

user.pre('save', async function (next) {
	let user = this;

	if(!user.isModified('password'))
		return next();
	try {
		let salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
		user.password = await bcrypt.hash(user.password, salt);
		next();
	} catch(e){
		console.error(e);
	}
});

user.methods.comparePassword = async function(password){
	let user = this;
	return bcrypt.compare(password, user.password)
};

const User = mongoose.model('User', user);
/**
 * export model definition
 * @type {Model}
 */
module.exports = User;