/* global require, module, process, __dirname */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectDatabase } = require("./db");

if (!process.env.ADMIN_ORIGIN) {
    throw new Error("ADMIN_ORIGIN must be configured for the admin API.");
}

const adminOriginUrl = new URL(process.env.ADMIN_ORIGIN);
if (!["http:", "https:"].includes(adminOriginUrl.protocol)) {
    throw new Error("ADMIN_ORIGIN must use HTTP or HTTPS.");
}
if (process.env.NODE_ENV === "production" && adminOriginUrl.protocol !== "https:") {
    throw new Error("ADMIN_ORIGIN must use HTTPS in production.");
}
const adminOrigin = adminOriginUrl.origin;

const app = express();
app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use("/api/admin", cors({ origin: adminOrigin, credentials: true }));
app.use("/api/admin", (req, res, next) => {
    if (["GET", "HEAD", "OPTIONS"].includes(req.method) || req.get("origin") === adminOrigin) {
        return next();
    }
    return res.status(403).json({ message: "Admin origin allowed nahi hai." });
});

app.use(async (req, res, next) => {
    try {
        await connectDatabase();
        next();
    } catch (error) {
        console.error("Mongo error:", error.message);
        res.status(503).json({ message: "Database unavailable." });
    }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/auth", authLimiter, require("./src/routes/auth"));
app.use("/api/admin/login", authLimiter);
app.use("/api/admin", require("./src/routes/admin"));

app.use((error, req, res, next) => {
    console.error("API error:", error);
    if (res.headersSent) return next(error);
    res.status(500).json({ message: "Server error." });
});

module.exports = app;
