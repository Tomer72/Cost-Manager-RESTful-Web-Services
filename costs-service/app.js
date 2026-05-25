require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const pinoHttp = require("pino-http");

const Cost = require("./models/cost.model");
const User = require("./models/user.model");
const Report = require("./models/report.model");
const Log = require("./models/log.model");

// Create the Express application and define shared constants.
const app = express();
const PORT = process.env.PORT || 3003;
const SERVICE_NAME = process.env.SERVICE_NAME || "costs-service";
const allowedCategories = ["food", "health", "housing", "sport", "education"];

// Enable JSON body parsing, CORS, and Pino HTTP logging.
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

// Save a log document in MongoDB after every HTTP response finishes.
app.use((req, res, next) => {
  res.on("finish", async () => {
    try {
      await Log.create({
        service: SERVICE_NAME,
        method: req.method,
        url: req.originalUrl,
        statusCode: res.statusCode
      });
    } catch (err) {
      req.log.error(err, "failed to save request log");
    }
  });

  next();
});

// Connect the service to MongoDB using the connection string from .env.
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("costs-service connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Add a new cost after validating the body and checking that the user exists.
app.post("/api/add", async (req, res) => {
  try {
    const { description, category, userid, sum, date } = req.body;

    // Validate required fields before trying to save anything to MongoDB.
    if (!description || !category || !userid || sum === undefined) {
      return res.status(400).json({ error: "missing required fields" });
    }

    // Validate that the category is one of the categories allowed by the project.
    if (!allowedCategories.includes(category)) {
      return res.status(400).json({ error: "invalid category" });
    }

    // Validate that the sum is a positive number.
    if (typeof sum !== "number" || sum <= 0) {
      return res.status(400).json({ error: "sum must be a positive number" });
    }

    // Validate that the selected date is not in the past. 
    const costDate = date ? new Date(date) : new Date();

    if (Number.isNaN(costDate.getTime())) {
      return res.status(400).json({ error: "invalid date" });
    }

    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    costDate.setHours(0, 0, 0, 0);
    if (costDate < today) {
      return res.status(400).json({ error: "date cannot be in the past" });
    }

    // Verify that the user exists before adding a cost for that userid.
    const user = await User.findOne({ id: Number(userid) });

    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }

    // Create and save the new cost document.
    const cost = new Cost({
      description,
      category,
      userid: Number(userid),
      sum,
      date: costDate
    });

    await cost.save();

    return res.status(201).json(cost);
  } catch (err) {
    req.log.error(err, "failed to add cost");
    return res.status(500).json({ error: "server error" });
  }
});

// Build the empty monthly report structure required by the assignment.
function createEmptyReport() {
  return {
    food: [],
    health: [],
    housing: [],
    sport: [],
    education: []
  };
}

// Check if the requested report is for a month that already ended.
function isPastMonth(year, month) {
  const now = new Date();
  const requestedMonth = new Date(Number(year), Number(month), 1);
  const currentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return requestedMonth < currentMonth;
}

// Return a monthly report grouped by category for a specific user.
app.get("/api/report", async (req, res) => {
  try {
    const { id, year, month } = req.query;

    // Validate that all required query parameters were sent.
    if (!id || !year || !month) {
      return res.status(400).json({ error: "missing required query parameters" });
    }

    const numericId = Number(id);
    const numericYear = Number(year);
    const numericMonth = Number(month);

    // Validate that id, year, and month are valid numbers.
    if (
      Number.isNaN(numericId) ||
      Number.isNaN(numericYear) ||
      Number.isNaN(numericMonth)
    ) {
      return res.status(400).json({ error: "id, year, and month must be numbers" });
    }

    // Validate month range so the date calculation is reliable.
    if (numericMonth < 1 || numericMonth > 12) {
      return res.status(400).json({ error:
        "month must be between 1 and 12" });
    }

    // For past months, return the cached report if it already exists.
    if (isPastMonth(numericYear, numericMonth)) {
      const cachedReport = await Report.findOne({
        userid: numericId,
        year: numericYear,
        month: numericMonth
      });

      if (cachedReport) {
        return res.json(cachedReport.report);
      }
    }

    // Find all costs in the requested month using a start date and end date.
    const startDate = new Date(numericYear, numericMonth - 1, 1);
    const endDate = new Date(numericYear, numericMonth, 1);

    const costs = await Cost.find({
      userid: numericId,
      date: {
        $gte: startDate,
        $lt: endDate
      }
    });

    // Group each cost into the matching category array.
    const report = createEmptyReport();

    for (const cost of costs) {
      report[cost.category].push({
        sum: cost.sum,
        description: cost.description,
        day: cost.date.getDate()
      });
    }

    const response = {
      userid: numericId,
      year: numericYear,
      month: numericMonth,
      costs: report
    };

    // Save reports for past months so future requests can reuse the result.
    if (isPastMonth(numericYear, numericMonth)) {
      await Report.findOneAndUpdate(
        { userid: numericId, year: numericYear, month: numericMonth },
        { report: response },
        { upsert: true, new: true }
      );
    }

    return res.json(response);
  } catch (err) {
    req.log.error(err, "failed to create report");
    return res.status(500).json({ error: "server error" });
  }
});

// Start the server only after the routes and middleware are defined.
app.listen(PORT, () => {
  console.log(`costs-service is running on port ${PORT}`);
});