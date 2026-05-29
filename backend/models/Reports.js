// Example validation match for server/models/Reports.js
const mongoose = require('mongoose');
const reportSchema = new mongoose.Schema({
  fileName: String,
  reportType: String,
  extractedText: String,
  status: String,
  insights: {
    overallHealth: Number,
    summary: String,
    diseaseRiskPrediction: String,
    parameters: Array,
    dietarySuggestions: Array,
    whatToAvoid: Array,
    lifestyleChanges: Array,
    medications: Array
  }
}, { timestamps: true });
module.exports = mongoose.model('Report', reportSchema);