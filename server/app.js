/* global require, module, process, __dirname */

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { connectDatabase } = require("./db");

function getDatabaseErrorResponse(error) {
    const errorMessage = error && typeof error.message === "string" ? error.message : "";

    if (!process.env.MONGO_URI) {
        return {
            code: "MONGO_URI_MISSING",
            message: "Database configuration missing: set MONGO_URI in the deployment environment.",
        };
    }

    if (
        (error && (error.code === 18 || error.codeName === "AuthenticationFailed"))
        || /authentication failed|bad auth/i.test(errorMessage)
    ) {
        return {
            code: "MONGO_AUTH_FAILED",
            message: "MongoDB authentication failed. Verify the Atlas database user's credentials.",
        };
    }

    if (
        (error && error.name === "MongooseServerSelectionError")
        || /\b(ENOTFOUND|ENODATA|ETIMEDOUT|ECONNREFUSED)\b|querySrv/i.test(errorMessage)
    ) {
        return {
            code: "MONGO_UNREACHABLE",
            message: "MongoDB could not be reached. Check Atlas Network Access and Vercel egress.",
        };
    }

    if (
        (error && error.name === "MongoParseError")
        || /invalid connection string|invalid scheme|must start with mongodb/i.test(errorMessage)
    ) {
        return {
            code: "MONGO_URI_INVALID",
            message: "MONGO_URI is invalid. Copy a valid connection string from MongoDB Atlas.",
        };
    }

    return {
        code: "DATABASE_CONNECTION_FAILED",
        message: "Database unavailable. Check the database connection and MongoDB network access.",
    };
}

function getAdminOriginConfig() {
    const origins = new Set();
    const configuredOrigins = [
        process.env.ADMIN_ORIGIN,
        process.env.VERCEL_URL,
        process.env.VERCEL_PROJECT_PRODUCTION_URL,
    ].filter(Boolean);

    for (const value of configuredOrigins) {
        let url;
        try {
            url = new URL(value.includes("://") ? value : `https://${value}`);
        } catch {
            return { origins: [], error: "Admin origin configuration must contain valid URLs." };
        }

        if (!["http:", "https:"].includes(url.protocol)) {
            return { origins: [], error: "Admin origins must use HTTP or HTTPS." };
        }
        if (process.env.NODE_ENV === "production" && url.protocol !== "https:") {
            return { origins: [], error: "Admin origins must use HTTPS in production." };
        }

        origins.add(url.origin);
    }

    if (origins.size === 0) {
        return { origins: [], error: "ADMIN_ORIGIN must be configured for the admin API." };
    }

    return { origins: [...origins], error: null };
}

const adminOriginConfig = getAdminOriginConfig();

const app = express();
app.locals.adminConfigurationError = adminOriginConfig.error;
app.use(helmet());
app.use(express.json({ limit: "100kb" }));

app.use("/api/admin", cors({ origin: adminOriginConfig.origins, credentials: true }));
app.use("/api/admin", (req, res, next) => {
    if (adminOriginConfig.error) {
        return res.status(503).json({ message: adminOriginConfig.error });
    }
    if (["GET", "HEAD", "OPTIONS"].includes(req.method) || adminOriginConfig.origins.includes(req.get("origin"))) {
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
        res.status(503).json(getDatabaseErrorResponse(error));
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
