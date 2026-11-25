const router = require("express").Router();
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Session = require("../models/Session");
const { requireUser } = require("../middlewares/auth");
const { signUserAccess, newRefreshToken, hashToken, refreshExpiry } = require("../utils/tokens");

const cleanPhone = (p) => String(p || "").replace(/[^\d+]/g, "");

const publicUser = (u) => ({ id: u._id, name: u.name, phone: u.phone, email: u.email, status: u.status });

async function issueTokens(user, device = {}) {
    const refreshToken = newRefreshToken();
    await Session.create({
        user: user._id,
        tokenHash: hashToken(refreshToken),
        deviceId: device.deviceId,
        deviceName: device.deviceName,
        expiresAt: refreshExpiry(),
    });
    return { accessToken: signUserAccess(user._id), refreshToken };
}

// POST /api/auth/register
router.post("/register", async (req, res) => {
    try {
        const { name, password, email } = req.body;
        const phone = cleanPhone(req.body.phone);

        if (!name?.trim() || phone.length < 10 || String(password || "").length < 6) {
            return res.status(400).json({ message: "Naam, sahi phone aur kam az kam 6 harf ka password dein." });
        }

        const exists = await User.findOne({
            $or: [{ phone }, ...(email ? [{ email: email.toLowerCase() }] : [])],
        });
        if (exists) return res.status(409).json({ message: "Ye phone ya email pehle se registered hai." });

        await User.create({
            name: name.trim(),
            phone,
            email: email || undefined,
            passwordHash: await bcrypt.hash(password, 12),
            status: "pending",
        });

        // Token nahi dete, pehle approval chahiye
        res.status(201).json({ status: "pending", message: "Account ban gaya. Approval ka intezar karein." });
    } catch (e) {
        res.status(500).json({ message: "Server error." });
    }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
    try {
        const phone = cleanPhone(req.body.phone);
        const { password, deviceId, deviceName } = req.body;

        const user = await User.findOne({ phone }).select("+passwordHash");
        const ok = user && (await bcrypt.compare(String(password || ""), user.passwordHash));
        if (!ok) return res.status(401).json({ code: "BAD_CREDENTIALS", message: "Phone ya password ghalat hai." });

        if (user.status === "pending") {
            return res.status(403).json({ code: "PENDING", message: "Aap ka account approval ka intezar kar raha hai." });
        }
        if (user.status === "blocked") {
            return res.status(403).json({ code: "BLOCKED", message: "Aap ka account block hai." });
        }

        user.lastLoginAt = new Date();
        await user.save();

        const tokens = await issueTokens(user, { deviceId, deviceName });
        res.json({ ...tokens, user: publicUser(user) });
    } catch {
        res.status(500).json({ message: "Server error." });
    }
});

// POST /api/auth/refresh  (rotation: purana token ek baar hi chalta hai)
router.post("/refresh", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ message: "refreshToken chahiye." });

        const session = await Session.findOne({ tokenHash: hashToken(refreshToken) });
        if (!session || session.expiresAt < new Date()) {
            return res.status(401).json({ code: "SESSION_EXPIRED", message: "Dobara login karein." });
        }

        const user = await User.findById(session.user);
        if (!user || user.status !== "approved") {
            await Session.deleteMany({ user: session.user });
            return res.status(403).json({ code: user?.status === "blocked" ? "BLOCKED" : "PENDING" });
        }

        await session.deleteOne();
        const tokens = await issueTokens(user, { deviceId: session.deviceId, deviceName: session.deviceName });
        res.json({ ...tokens, user: publicUser(user) });
    } catch {
        res.status(500).json({ message: "Server error." });
    }
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
    if (req.body.refreshToken) await Session.deleteOne({ tokenHash: hashToken(req.body.refreshToken) });
    res.json({ ok: true });
});

// GET /api/auth/me
router.get("/me", requireUser, (req, res) => res.json({ user: publicUser(req.user) }));

module.exports = router;