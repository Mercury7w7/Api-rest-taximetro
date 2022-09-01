/*const usuarioModel = require('../models/user');
const bcrypt = require('bcrypt');
const JWT = require('jsonwebtoken');
const {validationResult} = require('express-validator');
require('dotenv').config({path: '.env'});*/;


// fare based upon miles traveled and the hour of the day
exports.rates=(milesTraveled, pickupTime) => {
    var baseFare = 2.50;
    var costPerMile = 2.00;
    var nightSurcharge = 0.50; // 8pm to 6am, every night
  
    var cost = baseFare + (costPerMile * milesTraveled);
    
    // add the nightSurcharge from 8pm to 6am
  
    if (pickupTime >= 20 || pickupTime < 6) {
        cost += nightSurcharge;
    }
    
    return cost;
  };