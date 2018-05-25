/**
 * Created by Jose on 27/04/2016.
 */
'use strict';

const mongoose = require('mongoose'),
	{Schema} = mongoose;

const devices = new Schema({
	name: {type: String, required: "You must provide a name for this device"},
	mac: {type: String, required: "The mac of the device a required attribute", index: {unique: true}},
	linkedUsers: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

/**
 * Find a device based on user
 * @param {string} userId
 * @returns {Promise<[*]>}
 */
devices.statics.findByUser = function(userId){
	return this.find({linkedUsers: userId}).exec();
	/*return new Promise(function (resolve, reject) {
			_this.find({linkedUsers: user}, function (err, data) {
					if (err) return reject(err);
					return resolve(data);
			})
	});*/
};

/**
 * Link a user to given device
 * @param {string} deviceId
 * @param {string} userId
 * @returns {Promise}
 */
devices.statics.addUser = async function(deviceId, userId){
	const devices = this;

	let device = await devices.findById(deviceId).exec();
	if(device && device.linkedUsers.indexOf(userId) === -1){
		device.linkedUsers.push(userId);
	}

	return device.save();
};

/**
 * Unlink user from its devices
 * @param {string} userId
 * @returns {Promise}
 */
devices.statics.unlinkUser = async function(userId){
	let linkedUsers = await this.findByUser(userId);
	if(!linkedUsers){
		return;
	}

	if(!linkedUsers){
		return;
	}

	let promises = [];

	linkedUsers.forEach((device) =>{
		device.linkedUsers.forEach((item, index) =>{
			if(item.toString() === userId.toString())
				device.linkedUsers.splice(index, 1);
			promises.push(device.save());
		});
	});

	return Promise.resolve(Promise.all(promises));
};

const Device = mongoose.model('Device', devices);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = Device;