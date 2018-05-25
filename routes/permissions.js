/**
 * Created by Jose on 11/05/2016.
 */
'use strict';

const router = require('express').Router(),
	Permissions = require('../models/permissions'),
	User = require('../models/users'),
	moment = require('moment');

router.route('/')
	.get(async (req, resp) =>{
		let permissions = await Permissions.find().populate({
			path: 'users',
			select: '-password -allowedDevices -roles -username -permissions -__v'
		}).exec();
		resp.json(permissions);
	})
	.post(function(req, resp){
		let {from, until} = req.body;
		if(!from || !until)
			return resp.status(415).json({message: "Missed required arguments"});

		from = moment(from, 'DD-MM-YYYY').format();
		until = moment(until, 'DD-MM-YYYY').format();

		let permission = new Permissions({from, until});
		permission.save()
			.then(() => resp.json({message: "Permission created successfully"}))
			.catch((err) => resp.status(415).json(err));
	})
	.delete((req, resp) => Permissions.remove()
		.then(() => resp.json({message: "All permissions were deleted"}))
		.catch((err) => resp.status(500).json(err))
	);

router.route('/:id')
	.get(async (req, resp) =>{
		let permission = await Permissions.findById(req.params.id).populate({
			path: 'User',
			select: '-password -allowedDevices -roles -username -__v'
		}).exec();
		if(!permission){
			return resp.status(404).json({message: "permissions table is empty"});
		}
		resp.json(permission);
	})
	.put(async (req, resp) =>{
		let permission = await Permissions.findById(req.params.id).exec();
		let {from, until, users} = req.body;
		if(!permission){
			return resp.status(404).json({message: "Permission not found"});
		}

		permission.from = moment(from).format();
		permission.until = moment(until).format();
		permission.users = users;

		permission.save()
			.then(() => resp.json({message: "Permission updated successfully"}))
			.catch((err) => resp.status(415).json(err));
	})
	.delete((req, resp) => Permissions.remove({_id: req.params.id}).exec()
		.then(() => resp.json({message: "Permission deleted successfully"}))
		.catch((err) => resp.status(415).json(err))
	);

module.exports = router;