const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Admin = require("../models/Admin");
const AdminSession = require("../models/AdminSession");
const { getAdminCookie } = require("../utils/adminCookie");
const { hashToken } = require("../utils/tokens");

const bearer = (req) => {
    const h = req.headers.authorization || "";
    return h.startsWith("Bearer ") ? h.slice(7) : null;
};

// Mobile app ke protected routes ke liye
async function requireUser(req, res, next) {
    try {
        const token = bearer(req);
        if (!token) return res.status(401).json({ code: "NO_TOKEN", message: "Login zaruri hai." });

        const payload = jwt.verify(token, process.env.USER_JWT_SECRET);
        if (payload.role !== "user") throw new Error("bad role");

        const user = await User.findById(payload.sub).select("name phone status");
        if (!user) return res.status(401).json({ code: "NO_USER" });

        // Block foran kaam kare, token 15 min baaki ho tab bhi
        if (user.status !== "approved") {
            return res.status(403).json({ code: user.status === "blocked" ? "BLOCKED" : "PENDING" });
        }

        req.user = user;
        next();
    } catch {
        res.status(401).json({ code: "TOKEN_EXPIRED", message: "Token invalid ya expire." });
    }
}

// Admin panel ke liye (alag secret)
async function requireAdmin(req, res, next) {
    try {
        const token = getAdminCookie(req);
        if (!token) return res.status(401).json({ message: "Admin login zaruri hai." });

        const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        if (payload.role !== "admin") throw new Error("bad role");

        const session = await AdminSession.findOne({
            tokenHash: hashToken(token),
            expiresAt: { $gt: new Date() },
        });
        if (!session) return res.status(401).json({ message: "Admin session expire ho gaya." });

        const admin = await Admin.findById(payload.sub).select("_id email");
        if (!admin || String(session.admin) !== String(admin._id)) {
            return res.status(401).json({ message: "Admin nahi mila." });
        }

        req.admin = admin;
        next();
    } catch {
        res.status(401).json({ message: "Token invalid ya expire." });
    }
}

module.exports = { requireUser, requireAdmin };