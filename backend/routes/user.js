const express = require('express');
const router = express.Router();

const User = require('../models/User');
const userCtrl = require('../controllers/user');

router.get('/', userCtrl.getUser);
router.post('/', userCtrl.createUser);