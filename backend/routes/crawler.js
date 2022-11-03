const express = require('express');
const crwlerController = require('../controllers/crawlerController');
let crawlerRouter = express.Router();

// we protect the POST, PUT and DELETE methods
crawlerRouter.post('/crawl', crwlerController.crawl);
crawlerRouter.get('/history', crwlerController.getHistory);

module.exports = crawlerRouter;
