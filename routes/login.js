/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

let router = require('express').Router({
		mergeParams: true
	}),
	jwt = require('jsonwebtoken'),
	moment = require('moment'),
	config = require('../config/params'),
	Users = require('../models/users'),
	Activity = require('../models/activity'),
	invalid = {message: "Invalid credentials"};

router.route('/')
	.post(async (req, resp) =>{
		const {username, mac, password, rememberMe} = req.body;

		const act = new Activity({
			auditor: username,
			date: new Date(),
			device: mac || req.connection.remoteAddress
		});

		const attempt = await act.save();
		const user = await Users.findOne().where('username', username).populate('allowedDevices').populate('permissions').exec();

		if(!user){
			return resp.status(404).json(invalid);
		}

		let success = await user.comparePassword(password);
		if(!success){
			attempt.success = false;
			await attempt.save();
			return resp.send({message: 'invalid credentials'});
		}

		if(mac){
			let allowedDevices = user.allowedDevices.map((device) => device.mac.toLowerCase());

			let allowedByDate = user.permissions.some((permission) => moment().isBetween(permission.from, permission.until));

			if(user.roles.indexOf('audit') === -1){
				return resp.status(403).json({message: `Sorry ${user.name} but you don't have access as an auditor`});
			}else if(allowedDevices.indexOf(req.body.mac.toLowerCase()) === -1){
				return resp.status(403).json({message: `Sorry ${user.name} but this device is not authorized`});
			}else if(!allowedByDate){
				return resp.status(403).json({message: `Sorry ${user.name} but you are not allowed to use the application today`});
			}
		}

		attempt.success = true;
		await attempt.save();

		let token = jwt.sign({
			name: user.name,
			username: user.username,
			roles: user.roles
		}, config.jwt, {
			expiresIn: rememberMe ? 3600 * 24 * 31 : mac ? '24h' : '20h'
		});
		resp.setHeader('x-auth-token', token);
		resp.setHeader('Access-Control-Expose-Headers', 'x-auth-token');
		resp.end("Bienvenido " + user.name);
	});

module.exports = router;
