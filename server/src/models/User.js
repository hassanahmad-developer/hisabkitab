const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true, maxlength: 80 },
        phone: { type: String, required: true, unique: true, trim: true },
        email: { type: String, trim: true, lowercase: true, unique: true, sparse: true },
        passwordHash: { type: String, required: true, select: false },

        status: {
            type: String,
            enum: ["pending", "approved", "blocked"],
            default: "pending",
            index: true,
        },
        statusChangedAt: Date,
        blockReason: String,
        lastLoginAt: Date,
    },
    { timestamps: true }
);

userSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("User", userSchema);