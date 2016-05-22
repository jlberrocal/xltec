/**
 * Created by Jose on 27/04/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var devices = new schema({
    name: { type: String, required: "You must provide a name for this device" },
    mac: { type: String, required: "The mac of the device a required attribute", index: { unique: true } },
    linkedUsers: [{ type: schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Device', devices);