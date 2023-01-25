const { Timestamp } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Reference =new Schema({
  referenceId: String,
  referenceType: String
});

const Payload = new Schema({
  source: { type: String },
  reportType: { type: String },
  message: { type: String },
  reportId: { type: String },
  referenceResourceId: { type: String },
  referenceResourceType: { type: String },
});

const SpamReportSchema = new Schema({
  id: { type: String, required: true },
  source: { type: String },
  sourceIdentityId: { type: String },
  reference: { type: Reference },
  state: { type: String },
  payload: { type: Payload },
  created: { type: Date }
});

// Virtual for truncated id
SpamReportSchema.virtual("uid").get(function () {
  return this.id.split("-").pop();
});

// Export model
module.exports = mongoose.model("SpamReport", SpamReportSchema);
