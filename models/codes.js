/**
 * Created by Jose on 01/05/2016.
 */
/**
 * Created by Jose on 28/04/2016.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var codes = new Schema({
  code: { type: String, required: true, index: { unique: true } },
  observation: { type: String, default: ' ' },
  process: { type: String, required: true }
});

module.exports = mongoose.model('Code', codes);