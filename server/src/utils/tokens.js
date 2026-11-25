const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const ACCESS_TTL = "15m";
const REFRESH_DAYS = 30;

const signUserAccess = (userId) =>
    jwt.sign({ sub: String(userId), role: "user" }, process.env.USER_JWT_SECRET, { expiresIn: ACCESS_TTL });

const signAdminToken = (adminId, sessionId) =>
    jwt.sign({ sub: String(adminId), role: "admin", jti: sessionId }, process.env.ADMIN_JWT_SECRET, { expiresIn: "12h" });

const newRefreshToken = () => crypto.randomBytes(48).toString("hex");
const newAdminSessionId = () => crypto.randomBytes(32).toString("hex");
const hashToken = (t) => crypto.createHash("sha256").update(t).digest("hex");
const refreshExpiry = () => new Date(Date.now() + REFRESH_DAYS * 24 * 3600 * 1000);

module.exports = { signUserAccess, signAdminToken, newAdminSessionId, newRefreshToken, hashToken, refreshExpiry };