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

devices.statics.findByUser = function (user) {
    return this.find({linkedUsers: user}).exec();
    /*return new Promise(function (resolve, reject) {
        _this.find({linkedUsers: user}, function (err, data) {
            if (err) return reject(err);
            return resolve(data);
        })
    });*/
};

devices.statics.addUser = function (device, user) {
    const _this = this;
    return new Promise(function (resolve, reject) {
        _this.findById(device, function (err, data) {
            if (err) return reject(err);
            if (data.linkedUsers.indexOf(user) === -1) {
                data.linkedUsers.push(user);
                data.save(function (err, value) {
                    if (err) return reject(err);
                    return resolve(value);
                });
            }
        });
    });
};

devices.statics.unlinkUser = function (user, callback) {
    this.findByUser(user).then(function (data) {
        if (!data) return;
        let promises = [];

        data.forEach(function (device) {
            device.linkedUsers.forEach(function (item, index) {
                if (item.toString() === user.toString())
                    device.linkedUsers.splice(index, 1);
                promises.push(device.save());
            });
        });

        Promise.all(promises).then(function () {
            callback();
        }, function (err) {
            console.error(err);
        });
    });
};

const Device = mongoose.model('Device', devices);

/**
 * Export model definition
 * @type {Model}
 */
module.exports = Device;