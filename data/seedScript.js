const SpamReport = require("./../models/spamReport")
const fs = require("fs")

const jsonString = fs.readFileSync(__dirname+"/reports.json");
const spamReports = JSON.parse(jsonString).elements;

let seeds = []

spamReports.forEach(el => {
  seeds.push(new SpamReport (el))
})

let done = 0;

module.exports.seedSpamReports = async () => {
  try {
    await SpamReport.deleteMany({});

    for (let i = 0; i < seeds.length; i++) {
      seeds[i].save(function (err, result) {
        done++;
      });
    }
  } catch (err) {
    console.error(err);
  }

  console.log("Mock data is seeded from seed script.");
};

