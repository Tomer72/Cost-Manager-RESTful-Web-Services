const mongoose = require("mongoose");

// Define cached monthly reports for previous months.
// This supports the computed design pattern requirement.
const reportSchema = new mongoose.Schema({
  userid: {
    type: Number,
    required: true
  },

  // The year and month identify which monthly report this document stores.
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,
    required: true
  },

  // The report data is grouped by category and saved as a plain object.
  report: {
    type: Object,
    required: true
  }
});

// Prevent saving the same report twice for the same user and month.
reportSchema.index({ userid: 1, year: 1, month: 1 }, { unique: true });

// Export the Report model so app.js can save and reuse cached reports.
module.exports = mongoose.model("Report", reportSchema);