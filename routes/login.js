/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

let router = require('express').Router(),
	bodyParser = require('body-parser'),
	jwt = require('jsonwebtoken'),
	moment = require('moment'),
	cors = require('cors'),
	config = require('../config/params'),
	Users = require('../models/users'),
	Activity = require('../models/activity'),
	invalid = {message: "Invalid credentials"};
router.use(bodyParser.json());
router.use(cors());

router.route('/')
	.get(function(req, resp){
		resp.json({message: 'Exactly what are you trying to do?'});
	})
	.post(async (req, resp) =>{
		const act = new Activity({
			auditor: req.body.username,
			date: new Date(),
			device: req.body.mac
		});
		const attempt = await act.save();

		Users.findOne().where({username: req.body.username}).populate('allowedDevices').populate('permissions').exec().then((user) =>{
			if(!user){
				return resp.status(404).json(invalid);
			}

			console.log(`User ${req.body.username} is attempting to authenticate from ${req.body.mac ? 'a device [' + req.body.mac + ']' : 'the web page'}`);
			if(req.body.mac){
				let allowedDevices = user.allowedDevices.map(function(device){
					return device.mac.toLowerCase();
				});

				let allowedByDate = user.permissions.some(function(permission){
					return moment().isBetween(permission.from, permission.until);
				});

				if(user.roles.indexOf('audit') === -1) return resp.status(403).json({message: 'Sorry ' + user.name + " but you don't have access as auditor"});
				else if(allowedDevices.indexOf(req.body.mac.toLowerCase()) === -1) return resp.status(403).json({message: 'Sorry ' + user.name + " but this device is not authorized"});
				else if(!allowedByDate) return resp.status(403).json({message: 'Sorry ' + user.name + ' but you are not allowed to use the application today'});
			}
			user.comparePassword(req.body.password).then(async () => {
				attempt.success = true;
				await attempt.save();

				console.info(`${req.body.username} was authenticated at ${moment().format('hh:MM:ss')}`);
				let token = jwt.sign({
					name: user.name,
					username: user.username,
					roles: user.roles
				}, config.jwt, {
					expiresIn: req.body.rememberMe ? 3600 * 24 * 31 : req.body.mac ? '24h' : '20h'
				});
				resp.setHeader('x-auth-token', token);
				resp.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
				resp.end("Bienvenido " + user.name);
			}, function(err){
				return resp.status(400).json(err);
			});
		});
	});

module.exports = router;
