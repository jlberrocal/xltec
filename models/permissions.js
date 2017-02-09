/**
 * Created by Jose on 11/05/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    schema = mongoose.Schema,
    Users = require('./users');

var permission = new schema({
    from: { type: Date, required: "You must provide when start the permission" },
    until: { type: Date, required: "You must provide when start the permission" },
    users: [{ type: schema.Types.ObjectId, ref: 'User' }]
});

permission.pre('save', function (next) {
    let self = this;
    if (self.from > self.until) {
        self.invalidate('until', 'until can not be before of from');
        return next(self);
    }

    mongoose
        .models['Permission']
        .findOne()
        .where({
            '$or': [{
                '$and': [{
                    from: {
                        '$lte': self.from
                    }
                }, {
                    until: {
                        '$gte': self.from
                    }
                }]
            }, {
                '$and': [{
                    from: {
                        '$lte': self.until
                    }
                }, {
                    until: {
                        '$gte': self.until
                    }
                }]
            }]
        })
        .exec()
        .then(function (result) {
            if (result && self._id !== result._id) {
                self.invalidate("from", "there is a date overlap");
                next(self);
            } else next();
        }, function (err) {
            return console.error(err);
        });
});

permission.post('save', function (doc) {
    Users
        .find({permissions: doc._id})
        .exec()
        .then((users) => {
            if(users.length > 0) {
                users.forEach(user => {
                    if(doc.users.indexOf(user.id) === -1) {
                        user.permissions.splice(user.permissions.indexOf(doc._id), 1);
                        user.save().then(u => console.log('permission removed for user: %s', u.username));
                    }
                });
            }
        });
    Users
        .find()
        .where('_id')
        .in(doc.users)
        .exec()
        .then(users => {
            users
                .filter(user => user.permissions.indexOf(doc._id) == -1)
                .forEach(user => {
                    user.permissions.push(doc._id);
                    user.save().then(u => console.log('permission added for user: %s', u.username));
                });
        });
});

module.exports = mongoose.model('Permission', permission);