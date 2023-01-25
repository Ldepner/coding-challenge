const express = require('express');
var bodyParser = require('body-parser');
const path = require('path');
const seeds = require("./data/seedScript");
const mongoose = require('mongoose');
const SpamReport = require("./models/spamReport");

require('dotenv').config();

// **
// DB connection
// **

const mongoString = process.env.DATABASE_URL

mongoose.set('strictQuery', false)
mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error)
})

database.once('connected', () => {
  console.log('Database Connected');
})

// **
// Mock data seeding
// **

seeds.seedSpamReports();

// **
// App setup
// **

const app = express();

// create application/json parser
const jsonParser = bodyParser.json()

app.set("views", path.join(__dirname, "views"));
app.use(express.static(__dirname + '/public'));
app.set("view engine", "pug");

app.get('/', async (req, res) => {
  try {
    const spamReports = await SpamReport.find({state: "OPEN"}, null, {sort: {created: 1}});
    res.render('index', { spamReports: spamReports });

  } catch (err) {
    console.log(err);
    return;
  }
})

app.post('/block', jsonParser, async (req, res) => {
  try {
    const reportId = req.body.reportId;
    const report = await SpamReport.findOne({id: reportId})

    if (report == null) {
      res.sendStatus(404)
      return
    }

    // Call some external service to block content
    console.log(`Blocking content for ${report.payload.referenceResourceType}: ${report.payload.referenceResourceId}`)

    await SpamReport.updateOne(
        { id: reportId },
        { state: "CLOSED" }
    )

    res.sendStatus(200);
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.put('/reports/:reportId', jsonParser, async (req, res) => {
  try {
    const id = req.params.reportId;
    var updatedData = {}

    if ('ticketState' in req.body) {
      updatedData["state"] = req.body.ticketState
    }

    await SpamReport.findOneAndUpdate(
        { id: id },
        updatedData
    )

    res.sendStatus(200);
  }
  catch (error) {
    res.status(400).json({ message: error.message })
  }
})

app.listen(3000, function () {
  console.log('Spam handler app listening on port 3000!');
});