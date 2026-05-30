/*
  Defined data model for MongoDB which is used to store log data in the DB.
  Structure is:
  method: stores the HTTP verb - GET, POST, etc.
  url: The request path - /api/logs, /api/about, etc.
  status: HTTP response code - 200, 404, etc.
  service: Which service wrote this log - needed because all 4 services write to the same DB.
  timestamp: Date and time of the log.

  Collection name in MongoDB: 'logs'.
*/

const mongoose = require('mongoose');

// Define the schema for a single log entry
const logSchema = new mongoose.Schema({
    method: { type: String, required: true },
    url: { type: String, required: true },
    status: { type: Number, required: true },
    service: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Export the Log model mapped to the shared 'logs' collection
module.exports = mongoose.model('Log', logSchema, 'logs');
