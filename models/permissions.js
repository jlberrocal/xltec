/**
 * Created by Jose on 11/05/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema;

var permission = new schema({
    from: { type: Date, required: "You must provide when start the permission" },
    until: { type: Date, required: "You must provide when start the permission" },
    users: [{ type: schema.Types.ObjectId, ref: 'User' }]
});

permission.pre('save', function (next) {
    var self = this;
    if (self.from > self.until) {
        self.invalidate('until', 'until can not be before of from');
        return next(self);
    }
    mongoose.models['Permission'].findOne().where({ $or: [{ $and: [{ from: { $lte: self.from } }, { until: { $gte: self.from } }] }, { $and: [{ from: { $lte: self.until } }, { until: { $gte: self.until } }] }] }).exec().then(function (result) {
        if (result && self._id !== result._id) {
            self.invalidate("from", "there is a date overlap");
            console.error(result);
            next(self);
        } else next();
    }, function (err) {
        return console.error(err);
    });
});

module.exports = mongoose.model('Permission', permission);