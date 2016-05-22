/**
 * Created by Jose on 27/04/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    bcrypt = require('bcrypt-nodejs'),
    SALT_WORK_FACTOR = 10;

var user = new schema({
    name: { type: String, required: "The name is a required value" },
    username: { type: String, required: "The username is" +
    "" +
    "" +
    "cls" +
    " a required value", index: { unique: true } },
    password: { type: String, required: "The password is a required value" },
    roles: { type: Array, required: "You must provide at least one role" },
    allowedDevices: [{ type: schema.Types.ObjectId, ref: 'Device' }],
    permissions: [{ type: schema.Types.ObjectId, ref: 'Permission' }]
});

user.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

user.methods.comparePassword = function (password) {
    var user = this;
    return new Promise(function (success, error) {
        bcrypt.compare(password, user.password, function (err, match) {
            if (err) return error(err);else if (match) return success();else return error({ message: "Invalid password" });
        });
    });
};

module.exports = mongoose.model('User', user);