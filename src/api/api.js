const express = require('express');
const fs = require('fs');
const compression = require('compression');
var cors = require('cors');
var path = require('path');
const { roundTo, getDay } = require('../utils/utils');
const { DATA_DIR } = require('../utils/constants');
const {
  getAvailableForDashboard,
  getDataForPairAndPlatform,
  checkPlatform,
  getFetcherResults,
  getKinzaOverview
} = require('./dashboardUtils');
const app = express();

app.use(cors());
app.use(compression());

const port = process.env.API_PORT || 3000;

const cache = {};
const cacheDuration = 30 * 60 * 1000; // 30 min cache duration

app.get('/api/dashboard/overview', async (req, res, next) => {
  try {
    const fetcherResults = getFetcherResults();
    res.json(fetcherResults);
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

app.get('/api/dashboard/kinza-overview', async (req, res, next) => {
  try {
    const kinzaOverview = getKinzaOverview();
    res.json(kinzaOverview);
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

app.get('/api/dashboard/available/:platform', async (req, res, next) => {
  try {
    const platform = req.params.platform;
    checkPlatform(platform);
    const available = getAvailableForDashboard(platform);
    res.json(available);
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

app.get('/api/dashboard/:platform/:base/:quote', async (req, res, next) => {
  try {
    const platform = req.params.platform;
    checkPlatform(platform);
    const base = req.params.base;
    const quote = req.params.quote;

    const data = getDataForPairAndPlatform(platform, base, quote);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

app.get('/api/qc/price/:platform/:base/:quote', async (req, res, next) => {
  try {
    throw new Error('NOT IMPLEMENTED');
    // const platform = req.params.platform;
    // checkPlatform(platform);
    // const base = req.params.base;
    // const quote = req.params.quote;

    // res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
    next();
  }
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
