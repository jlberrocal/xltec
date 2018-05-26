/**
 * Created by Jose on 27/04/2016.
 */
'use strict';

const router = require('express').Router({
		mergeParams: true
	}),
	Users = require('../models/users'),
	Devices = require('../models/devices'),
	Permissions = require('../models/permissions');

router.route('/')
	.get(async (req, resp) =>{
		let {page, pageSize, filters, sort} = req.query;
		try{
			let query = Users.find()
				.select('_id name username roles allowedDevices')
				.populate('allowedDevices', '-__v');

			let count = Users.find().select('_id').count().exec();
			query = query.paginate(page, pageSize).sorter(sort);

			let users = await query.exec();

			resp.json({
				results: users,
				total: await count
			});
		} catch(e){
			resp.end(e).status(500);
		}
	})
	.post(function(req, resp){
		if(req.body){
			let user = new Users(req.body);
			user.save()
				.then(() => resp.json({message: "User saved successfully"}))
				.catch((err) => resp.json(err));
		}
	});

router.route('/:username')
	.get(async (req, resp) =>{
		let user = await Users.findOne({username: req.params.username}).select('_id username name allowedDevices roles').exec();

		if(!user){
			return resp.json({error: "User not found"}).status(404);
		}
		resp.json(user);
	})
	.put(async (req, resp) =>{
		let user = await Users.findOne({username: req.params.username}).exec();
		if(!user){
			return resp.json({error: "User not found"}).status(404);
		}

		let {username, name, password, roles, allowedDevices, permissions} = req.body;
		await Devices.unlinkUser(user._id);

		user.username = username;
		user.name = name;
		user.password = password;
		user.roles = roles;
		user.allowedDevices = allowedDevices.map(async device =>{
			await Devices.addUser(device, user._id);
			return device;
		});

		user.permissions = permissions.map(async permission =>{
			let permissionDoc = await Permissions.findById(permission).exec();
			permissionDoc.users.push(user._id);
			await permissionDoc.save();
			return permission;
		});

		user.save()
			.then(() => resp.json({message: "User updated successfully"}))
			.catch((err) => resp.status(500).json(err));
	})
	.delete((req, resp) => Users.remove({username: req.params.username}).exec()
		.then(() => resp.json({message: 'user deleted successfully'}))
		.catch(err => resp.json(err))
	);

router.route('/auditors/json')
	.get((req, resp) => Users.find({roles: {$in: ['audit']}})
		.then(result => resp.json(result))
		.catch(err => resp.error(err))
	);

module.exports = router;