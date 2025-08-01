const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage for received webhooks (use a database in production)
let webhookHistory = [];

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.raw({ type: "*/*", limit: "10mb" }));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Main webhook endpoint - accepts all HTTP methods
app.all("/webhook", (req, res) => {
  const webhookData = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    rawBody:
      req.body && req.body.toString ? req.body.toString() : req.body || "",
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
  };

  // Store webhook data (keep only last 100 entries)
  webhookHistory.unshift(webhookData);
  if (webhookHistory.length > 100) {
    webhookHistory = webhookHistory.slice(0, 100);
  }

  console.log("Webhook received:", JSON.stringify(webhookData, null, 2));

  // Respond with success
  res.status(200).json({
    success: true,
    message: "Webhook received successfully",
    id: webhookData.id,
    timestamp: webhookData.timestamp,
  });
});

// Custom webhook endpoint with name parameter
app.all("/webhook/:name", (req, res) => {
  const webhookData = {
    id: uuidv4(),
    timestamp: new Date().toISOString(),
    name: req.params.name,
    method: req.method,
    url: req.url,
    headers: req.headers,
    query: req.query,
    body: req.body,
    rawBody:
      req.body && req.body.toString ? req.body.toString() : req.body || "",
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get("User-Agent"),
  };

  // Store webhook data
  webhookHistory.unshift(webhookData);
  if (webhookHistory.length > 100) {
    webhookHistory = webhookHistory.slice(0, 100);
  }

  console.log(
    `Webhook '${req.params.name}' received:`,
    JSON.stringify(webhookData, null, 2)
  );

  res.status(200).json({
    success: true,
    message: `Webhook '${req.params.name}' received successfully`,
    id: webhookData.id,
    timestamp: webhookData.timestamp,
  });
});

// API endpoint to get webhook history
app.get("/api/webhooks", (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const offset = parseInt(req.query.offset) || 0;

  const paginatedHistory = webhookHistory.slice(offset, offset + limit);

  res.json({
    webhooks: paginatedHistory,
    total: webhookHistory.length,
    limit,
    offset,
  });
});

// API endpoint to get specific webhook by ID
app.get("/api/webhooks/:id", (req, res) => {
  const webhook = webhookHistory.find((w) => w.id === req.params.id);

  if (!webhook) {
    return res.status(404).json({ error: "Webhook not found" });
  }

  res.json(webhook);
});

// API endpoint to clear webhook history
app.delete("/api/webhooks", (req, res) => {
  const count = webhookHistory.length;
  webhookHistory = [];
  res.json({
    success: true,
    message: `Cleared ${count} webhooks from history`,
  });
});

// Test endpoint to send a test webhook to your local app
app.post("/api/test-webhook", async (req, res) => {
  const { url, method = "POST", headers = {}, body = {} } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    const fetch = (await import("node-fetch")).default;

    const response = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: method.toLowerCase() !== "get" ? JSON.stringify(body) : undefined,
    });

    const responseData = await response.text();

    res.json({
      success: true,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Serve the main page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    availableEndpoints: [
      "GET /",
      "GET /health",
      "ALL /webhook",
      "ALL /webhook/:name",
      "GET /api/webhooks",
      "GET /api/webhooks/:id",
      "DELETE /api/webhooks",
      "POST /api/test-webhook",
    ],
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error("Error:", error);
  res.status(500).json({
    error: "Internal server error",
    message: error.message,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook testing server running on port ${PORT}`);
  console.log(`📡 Webhook endpoint: http://localhost:${PORT}/webhook`);
  console.log(`🌐 Web interface: http://localhost:${PORT}`);
  console.log(`💡 API documentation: http://localhost:${PORT}/api/webhooks`);
});

module.exports = app;
