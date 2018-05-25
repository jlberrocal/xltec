/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

const router = require('express').Router({
		mergeParams: true
	}),
	Devices = require('../models/devices');

router.route('/')
	.get(async (req, resp) =>{
		const devices = await Devices.find()
			.populate({
				path: 'linkedUsers',
				select: '-password -__v -allowedDevices -roles -username'
			})
			.exec();
		resp.json(devices.length > 0 ? devices : {message: "There is no devices registered"});
	})
	.post(async (req, resp) =>{
		const device = new Devices(req.body);
		device.save().then(function(){
			return resp.json({message: "Device stored successfully"});
		}, function(err){
			return resp.status(500).json(err);
		});
	});

router.route('/:id')
	.get(async (req, resp) =>{
		let device = await Devices.findById(req.params.id).exec();
		if(!device){
			resp.status(404);
		}
		resp.json(device ? {message: "Device not found"} : device);
	})
	.put(async (req, resp) =>{
		let {name, mac, users} = req.body;
		let {id} = req.params;
		let device = Devices.findById(id).exec();

		if(!device){
			return resp.json({message: "Device not found"}).status(404);
		}
		device.name = name;
		device.mac = mac;
		device.linkedUsers = users;

		device.save()
			.then(() => resp.json({message: "Device updated successfully"}))
			.catch(err => resp.status(500).json(err));
	})
	.delete(async (req, resp) =>{
		try{
			await Devices.remove({_id: req.params.id})
		}catch(e){

		}
		Devices.remove({_id: req.params.id}, function(err){
			if(err) return resp.error(err);
			return resp.json({message: "Device removed successfully"});
		});
	});

module.exports = router;