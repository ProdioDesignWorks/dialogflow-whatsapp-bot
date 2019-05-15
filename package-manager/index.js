const dialogflow = require('dialogflow');
const uuid = require('uuid/v4');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

module.exports = { 
	dialogflow: dialogflow, 
	uuid: uuid,
	express: express,
	bodyParser: bodyParser,
	axios: axios,
};