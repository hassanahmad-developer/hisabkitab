const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Admin = require("../models/Admin");
const AdminSession = require("../models/AdminSession");
const User = require("../models/User");
const Session = require("../models/Session");
const { requireAdmin } = require("../middlewares/auth");
const { signAdminToken, newAdminSessionId, hashToken } = require("../utils/tokens");
const { getAdminCookie, setAdminCookie, clearAdminCookie, ADMIN_SESSION_TTL_MS } = require("../utils/adminCookie");

// POST /api/admin/login
router.post("/login", async (req, res) => {
    const email = String(req.body.email || "").toLowerCase().trim();
    const admin = await Admin.findOne({ email }).select("+passwordHash");

    if (!admin || !(await bcrypt.compare(String(req.body.password || ""), admin.passwordHash))) {
        return res.status(401).json({ message: "Email ya password ghalat hai." });
    }
    const token = signAdminToken(admin._id, newAdminSessionId());
    await AdminSession.create({
        admin: admin._id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + ADMIN_SESSION_TTL_MS),
    });
    setAdminCookie(res, token);
    res.json({ admin: { email: admin.email, name: admin.name } });
});

router.post("/logout", async (req, res) => {
    const token = getAdminCookie(req);
    if (token) await AdminSession.deleteOne({ tokenHash: hashToken(token) });
    clearAdminCookie(res);
    res.json({ ok: true });
});

router.use(requireAdmin);

// GET /api/admin/users - return all users; filtering is handled by the admin UI.
router.get("/users", async (req, res) => {
    const [users, grouped] = await Promise.all([
        User.find({}).sort({ createdAt: -1 }).lean(),
        User.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]),
    ]);

    const counts = { pending: 0, approved: 0, blocked: 0 };
    grouped.forEach((g) => (counts[g._id] = g.n));

    res.json({ users, total: users.length, page: 1, counts });
});

// PATCH /api/admin/users/:id/status   body: { status, reason? }
router.patch("/users/:id/status", async (req, res) => {
    const { status, reason } = req.body;
    if (!["approved", "blocked", "pending"].includes(status)) {
        return res.status(400).json({ message: "Invalid status." });
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { status, statusChangedAt: new Date(), blockReason: status === "blocked" ? reason || "" : "" },
        { new: true }
    );
    if (!user) return res.status(404).json({ message: "User nahi mila." });

    // Block hone par saare devices se logout
    if (status !== "approved") await Session.deleteMany({ user: user._id });

    res.json({ user });
});

module.exports = router;