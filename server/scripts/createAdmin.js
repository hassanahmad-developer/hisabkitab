const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("../src/models/Admin");

(async () => {
    const [email, password] = process.argv.slice(2);
    if (!email || !password) return console.log("Use: node scripts/createAdmin.js email password");

    await mongoose.connect(process.env.MONGO_URI);
    await Admin.create({ email, passwordHash: await bcrypt.hash(password, 12) });
    console.log("Admin created:", email);
    process.exit(0);
})();