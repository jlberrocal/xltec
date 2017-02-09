/**
 * Created by Jose on 27/04/2016.
 */
'use strict';
let express         = require('express'),
    app             = express(),
    config          = require('./config/params'),
    cors            = require('cors'),
    users           = require('./routes/users'),
    login           = require('./routes/login'),
    devices         = require('./routes/devices'),
    permissions     = require('./routes/permissions'),
    processes       = require('./routes/processes'),
    codes           = require('./routes/codes'),
    jwtMiddleware   = require('./middleware/jwt'),
    mongoose        = require('mongoose');

app.use(cors());
app.use('/api/login', login);
app.use('/api/users', jwtMiddleware, users);
app.use('/api/devices', jwtMiddleware, devices);
app.use('/api/permissions', jwtMiddleware, permissions);
app.use('/api/process', jwtMiddleware, processes);
app.use('/api/codes', jwtMiddleware, codes);

app.get('/api', function (req, resp) {
    resp.json({message: "Entry point of the api"});
});

app.use(function (req, resp, next) {
    resp.status(404).json({error: "The route that you are trying to access is not available"});
});

mongoose.connect(config.mongoUrl, function (err) {
    if(err) return console.error(err);
    console.info("Connected to DB");
});

app.listen(process.env.PORT || config.port, function () {
    console.info("Application listening on port: ", config.port);
});
