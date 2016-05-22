/**
 * Created by Jose on 19/05/2016.
 */
'use strict';

var router = require('express').Router(),
    path = require('path');

router.get('/', function (req, resp) {
    var file = path.join(__dirname, '../apk', 'xltec.apk');
    console.log(file);
    resp.download(file, function () {
        return console.log("application downloaded from " + req.ip);
    });
});

module.exports = router;