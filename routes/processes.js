/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

const router = require('express').Router(),
    bodyParser = require('body-parser'),
    Migration = require('../models/migration'),
    Baggage = require('../models/baggage'),
    Customs = require('../models/customs'),
    EntrancesTracking = require('../models/entranceTracking'),
    Taxes = require('../models/taxes'),
    CheckIn = require('../models/checkIn'),
    Security = require('../models/security'),
    XRays = require('../models/xRays'),
    CommercialTracking = require('../models/commercialTracking'),
    Boarding = require('../models/boarding'),
    DepartureTracking = require('../models/departureTracking'),
    xlsx = require('../utils/mongo-xlsx'),
    fs = require('fs');

router.use(bodyParser.json({limit: 1024*1024*50}));
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/bundle', function (req, resp) {
    let promises = [];
    let body = {};

    Object.keys(req.body).forEach(key => {
        if(req.body[key] && req.body[key].length > 0) {
            req.body[key].forEach(item => {
                item._id = item.Id + item.auditor + "-" + item.dateISO;
                delete item.Id;
            });
            body[key] = req.body[key];
        }
    });

    if(Object.keys(body).length === 0)
        return resp.send("No se enviaron datos al servidor");

    if(body.migration) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = Migration.collection.initializeUnorderedBulkOp();

            body.migration.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({'Migracion Entrada': result.nUpserted});
            }));
        }));
    }
    if(body.baggage) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = Baggage.collection.initializeUnorderedBulkOp();

            body.baggage.forEach(item => {
                item.justificationCode = item.justificationCode.split(',');
                item.justificationText = item.justificationText.split(',');
                item.lastLuggageTakenBy = item.lastLuggageTakenBy ? 'G' : 'P';

                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({Equipaje: result.nUpserted});
            }));
        }));
    }

    if(body.customs)
        promises.push(new Promise((resolve, reject) => {
            let bulk = Customs.collection.initializeUnorderedBulkOp();

            body.customs.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({Aduanas: result.nUpserted});
            }));
        }));
    if(body.entrance) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = EntrancesTracking.collection.initializeUnorderedBulkOp();

            body.entrance.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({"Seguimiento entrada": result.nUpserted});
            }));
        }));
    }

    if(body.taxes) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = Taxes.collection.initializeUnorderedBulkOp();

            body.taxes.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({Impuestos: result.nUpserted});
            }));
        }));
    }

    if(body.checkIn) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = CheckIn.collection.initializeUnorderedBulkOp();

            body.checkIn.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({CheckIn: result.nUpserted});
            }));
        }));
    }

    if(body.security) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = Security.collection.initializeUnorderedBulkOp();

            body.security.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({'Migración Salida': result.nUpserted});
            }));
        }));
    }

    if(body.xRays) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = XRays.collection.initializeUnorderedBulkOp();

            body.xRays.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({"Rayos X": result.nUpserted});
            }));
        }));
    }

    if(body.commercial) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = CommercialTracking.collection.initializeUnorderedBulkOp();

            body.commercial.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({"Seguimiento comercial": result.nUpserted});
            }));
        }));
    }

    if(body.boarding) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = Boarding.collection.initializeUnorderedBulkOp();

            body.boarding.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({Abordaje: result.nUpserted});
            }));
        }));
    }

    if(body.departure) {
        promises.push(new Promise((resolve, reject) => {
            let bulk = DepartureTracking.collection.initializeUnorderedBulkOp();

            body.departure.forEach((item) => {
                bulk.find({_id: item._id}).upsert().updateOne({$set:item});
            });

            bulk.execute((function (err, result) {
                if(err)
                    return reject(err);
                resolve({"Seguimiento salida": result.nUpserted});
            }));
        }));
    }

    Promise.all(promises)
        .then(results => {
            let rest = {};
            results.forEach(result => {
                Object.assign(rest,result);
            });
            resp.send(rest);
        })
        .catch(err => {
            console.error(err);
            resp.status(500).send(err || 'There was an error')
        });
});

router.route('/:process').get(function (req, resp) {
    switch (req.params.process) {
        case 'migration':
            Migration.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of migration" });
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'baggage':
            Baggage.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of baggage" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'customs':
            Customs.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of customs" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'entrance':
            EntrancesTracking.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of entrance tracking" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'taxes':
            Taxes.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of taxes" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'checkIn':
            CheckIn.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of check in" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'security':
            Security.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of security" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'xRays':
            XRays.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of x-rays" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'commercial':
            CommercialTracking.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of commercial tracking" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'boarding':
            Boarding.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of boarding" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
        case 'departure':
            DepartureTracking.find().sort({ 'date': 'asc', 'auditor': 'asc' }).select('-id -__v').exec().then(function (process) {
                if (process.length > 0) return resp.json(process);
                resp.status(404).json({ message: "There is no records of departure tracking" });
            }, function (err) {
                return resp.json(err).status(500);
            });
            break;
    }
}).post(function (req, resp) {
    switch (req.params.process) {
        case 'migration':
            Migration.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de migración");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'baggage':
            req.body.forEach(function (item) {
                item.justificationCode = item.justificationCode.split(',');
                item.justificationText = item.justificationText.split(',');
                item.lastLuggageTakenBy = item.lastLuggageTakenBy ? 'G' : 'P';
            });
            Baggage.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de equipaje");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'customs':
            Customs.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de aduanas");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'entrance':
            EntrancesTracking.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de seguimiento de entrada");
            }, function (err) {
                return resp.status(400).json(err);
            });
            break;
        case 'taxes':
            Taxes.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de impuestos");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'checkIn':
            CheckIn.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de check-in");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'security':
            Security.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de seguridad");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'xRays':
            XRays.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de rayos x");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'commercial':
            CommercialTracking.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de seguimiento comercial");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'boarding':
            Boarding.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de abordaje");
            }, function (err) {
                resp.status(500).json(err);
            });
            break;
        case 'departure':
            DepartureTracking.create(req.body).then(function (values) {
                return resp.send("El servidor almacenó " + values.length + " registros de seguimiento de salida");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
    }
}).delete(function (req, resp) {
    switch (req.params.process) {
        case 'migration':
            Migration.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'baggage':
            Baggage.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'customs':
            Customs.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'entrance':
            EntrancesTracking.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'taxes':
            Taxes.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'checkIn':
            CheckIn.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'security':
            Security.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'xRays':
            XRays.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'commercial':
            CommercialTracking.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'boarding':
            Boarding.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
        case 'departure':
            DepartureTracking.remove().exec().then(function () {
                return resp.json("Records deleted successfully");
            }, function (err) {
                return resp.status(500).json(err);
            });
            break;
    }
});
router.get('/:process/xlsx', function (req, resp) {
    switch (req.params.process) {
        case 'migration':
            Migration.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {

                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Puestos Disponibles",
                    access: "availablePositions",
                    type: "number"
                }, {
                    displayName: "Puestos Abiertos",
                    access: "openedPositions",
                    type: "number"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "# Ventanilla",
                    access: "attentionWindow",
                    type: "number"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'migracion-entrada.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'baggage':
            Baggage.find().sort({ 'firstLuggageIn': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "Aerolínea",
                    access: "airline",
                    type: "string"
                }, {
                    displayName: "# Vuelo",
                    access: "flyNumber",
                    type: "number"
                }, {
                    displayName: "Tipo Aeronave",
                    access: "airplaneType",
                    type: "string"
                }, {
                    displayName: "Última maleta tomada por (P o G)",
                    access: "lastLuggageTakenBy",
                    type: "string"
                }, {
                    displayName: "Total de Maletas del Vuelo",
                    access: "luggageCount",
                    type: "number"
                }, {
                    displayName: "# de pasajeros en el vuelo",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Primera maleta en la banda",
                    access: "firstLuggageIn",
                    type: "date"
                }, {
                    displayName: "Última maleta en la banda",
                    access: "lastLuggageInBand",
                    type: "date"
                }, {
                    displayName: "Última maleta retirada de la banda",
                    access: "lastLuggageTaken",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                data.map(function (item) {
                    return item.justificationText = item.justificationText.join(';');
                });
                data.map(function (item) {
                    return item.justificationCode = item.justificationCode.join(';');
                });
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    console.error(err);
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'equipaje.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });
            break;
        case 'customs':
            Customs.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Puestos Disponibles",
                    access: "availablePositions",
                    type: "number"
                }, {
                    displayName: "Puestos Abiertos",
                    access: "openedPositions",
                    type: "number"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "2da Rev",
                    access: "secondRevision",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'aduanas.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'entrance':
            EntrancesTracking.find().sort({ auditor: 'asc', passengersCount: 'asc', entranceHour: 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "Aerolínea",
                    access: "airline",
                    type: "string"
                }, {
                    displayName: "# Vuelo",
                    access: "flyNumber",
                    type: "number"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "2da Rev",
                    access: "secondRevision",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'seguimiento-entrada.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'taxes':
            Taxes.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Puestos Disponibles",
                    access: "availablePositions",
                    type: "number"
                }, {
                    displayName: "Puestos Abiertos",
                    access: "openedPositions",
                    type: "number"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'impuestos.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'checkIn':
            CheckIn.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "Aerolínea",
                    access: "airline",
                    type: "string"
                }, {
                    displayName: "# Vuelo",
                    access: "flyNumber",
                    type: "number"
                }, {
                    displayName: "Agentes de Seguridad",
                    access: "securityAgents",
                    type: "number"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Maletas de mano",
                    access: "handLuggage",
                    type: "number"
                }, {
                    displayName: "Maletas Registradas",
                    access: "registeredLuggage",
                    type: "number"
                }, {
                    displayName: "Puestos Asignados",
                    access: "availablePositions",
                    type: "number"
                }, {
                    displayName: "Puestos Abiertos",
                    access: "openedPositions",
                    type: "number"
                }, {
                    displayName: "Tipo de fila",
                    access: "queueType",
                    type: "string"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "Sistema / Manual",
                    access: "attentionSystem",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'check-in.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'security':
            Security.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Puestos Disponibles",
                    access: "availablePositions",
                    type: "number"
                }, {
                    displayName: "Puestos Abiertos",
                    access: "openedPositions",
                    type: "number"
                }, {
                    displayName: "Ventanilla Atención",
                    access: "attentionWindow",
                    type: "number"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'migracion-salida.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'xRays':
            XRays.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Puestos Disponibles",
                    access: "availablePositions",
                    type: "number"
                }, {
                    displayName: "Puestos Abiertos",
                    access: "openedPositions",
                    type: "number"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'rayos.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'commercial':
            CommercialTracking.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Aerolínea",
                    access: "airline",
                    type: "string"
                }, {
                    displayName: "# Vuelo",
                    access: "flyNumber",
                    type: "number"
                }, {
                    displayName: "Sitio Visitado",
                    access: "placeVisited",
                    type: "number"
                }, {
                    displayName: "¿Compró?",
                    access: "bought",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'seguimiento-comercial.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'boarding':
            Boarding.find().sort({ 'entranceHour': 'asc', 'auditor': 'asc' }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "Línea Aérea",
                    access: "airline",
                    type: "string"
                }, {
                    displayName: "# Vuelo",
                    access: "flyNumber",
                    type: "number"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Puestos Disponibles",
                    access: "availablePositions",
                    type: "number"
                }, {
                    displayName: "Puestos Abiertos",
                    access: "openedPositions",
                    type: "number"
                }, {
                    displayName: "Proceso",
                    access: "process",
                    type: "string"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'abordaje.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
        case 'departure':
            DepartureTracking.find().sort({ auditor: 'asc', passengersCount: 'asc', entranceHour: 'asc', }).select('-_id -__v').exec().then(function (data) {
                var model = [{
                    displayName: "Auditor",
                    access: "auditor",
                    type: "string"
                }, {
                    displayName: "Fecha",
                    access: "date",
                    type: "date"
                }, {
                    displayName: "Aerolínea",
                    access: "airline",
                    type: "string"
                }, {
                    displayName: "# Vuelo",
                    access: "flyNumber",
                    type: "number"
                }, {
                    displayName: "# de Pasajeros",
                    access: "passengersCount",
                    type: "number"
                }, {
                    displayName: "Proceso hecho",
                    access: "process",
                    type: "number"
                }, {
                    displayName: "H Entrada al Punto",
                    access: "entranceHour",
                    type: "date"
                }, {
                    displayName: "H Salida del Punto",
                    access: "departHour",
                    type: "date"
                }, {
                    displayName: "Tiempo",
                    access: "totalTime",
                    type: "float"
                }, {
                    displayName: "Cod",
                    access: "justificationCode",
                    type: "number"
                }, {
                    displayName: "Observaciones",
                    access: "justificationText",
                    type: "string"
                }];
                xlsx.mongoData2Xlsx(data, model, function (err, info) {
                    if (err) return resp.status(500).end();
                    resp.download(info.fullPath, 'seguimiento-salida.xlsx', function () {
                        fs.unlinkSync(info.fullPath);
                    });
                });
            });break;
    }
});

router.route('/report/:user').get(function (req, resp) {
    Promise.all([Promise.resolve(Migration.find({ auditor: req.params.user }).count().then(function (count) {
        return { "Migración": count };
    })), Promise.resolve(Baggage.find({ auditor: req.params.user }).count().then(function (count) {
        return { Equipaje: count };
    })), Promise.resolve(Customs.find({ auditor: req.params.user }).count().then(function (count) {
        return { Aduanas: count };
    })), Promise.resolve(EntrancesTracking.find({ auditor: req.params.user }).count().then(function (count) {
        return { "Seguimiento Entrada": count };
    })), Promise.resolve(Taxes.find({ auditor: req.params.user }).count().then(function (count) {
        return { Impuestos: count };
    })), Promise.resolve(CheckIn.find({ auditor: req.params.user }).count().then(function (count) {
        return { CheckIn: count };
    })), Promise.resolve(Security.find({ auditor: req.params.user }).count().then(function (count) {
        return { Seguridad: count };
    })), Promise.resolve(XRays.find({ auditor: req.params.user }).count().then(function (count) {
        return { "Rayos X": count };
    })), Promise.resolve(CommercialTracking.find({ auditor: req.params.user }).count().then(function (count) {
        return { "Seguimiento Comercial": count };
    })), Promise.resolve(Boarding.find({ auditor: req.params.user }).count().then(function (count) {
        return { Abordaje: count };
    })), Promise.resolve(DepartureTracking.find({ auditor: req.params.user }).count().then(function (count) {
        return { "Seguimiento Comercial": count };
    }))]).then(function (result) {
        var user = {};
        user[req.query.name] = result.filter(function (item) {
            return Object.keys(item).map(function (key) {
                    return item[key];
                })[0] > 0;
        });
        resp.json(user);
    }, function (err) {
        return resp.error(err);
    });
});
module.exports = router;
