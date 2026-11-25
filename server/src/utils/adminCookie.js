/* global process, module */

const ADMIN_COOKIE_NAME = "admin_session";
const ADMIN_COOKIE_PATH = "/api/admin";
const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000;
let secureCookie = false;
try {
    secureCookie = new URL(process.env.ADMIN_ORIGIN).protocol === "https:";
} catch {
    // Admin routes return a configuration error before any cookie operation.
}

function getAdminCookie(req) {
    const prefix = `${ADMIN_COOKIE_NAME}=`;
    const cookie = String(req.headers.cookie || "")
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith(prefix));
    return cookie ? cookie.slice(prefix.length) : null;
}

function setAdminCookie(res, token) {
    res.cookie(ADMIN_COOKIE_NAME, token, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: secureCookie ? "none" : "strict",
        path: ADMIN_COOKIE_PATH,
        maxAge: ADMIN_SESSION_TTL_MS,
    });
}

function clearAdminCookie(res) {
    res.clearCookie(ADMIN_COOKIE_NAME, {
        httpOnly: true,
        secure: secureCookie,
        sameSite: secureCookie ? "none" : "strict",
        path: ADMIN_COOKIE_PATH,
    });
}

module.exports = { getAdminCookie, setAdminCookie, clearAdminCookie, ADMIN_SESSION_TTL_MS };
