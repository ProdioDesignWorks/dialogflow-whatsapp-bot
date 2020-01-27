const dialogflow = require('dialogflow');
const uuid = require('uuid/v4');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const url = require("url");
const path = require("path");
const fs = require("fs");

module.exports = { 
	dialogflow: dialogflow, 
	uuid: uuid,
	express: express,
	bodyParser: bodyParser,
	axios: axios,
	url: url,
	path: path,
	fs: fs,
};