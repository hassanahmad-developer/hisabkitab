const mongoose = require("mongoose");

module.exports = mongoose.model(
    "Admin",
    new mongoose.Schema(
        {
            name: { type: String, default: "Admin" },
            email: { type: String, required: true, unique: true, lowercase: true, trim: true },
            passwordHash: { type: String, required: true, select: false },
        },
        { timestamps: true }
    )
);