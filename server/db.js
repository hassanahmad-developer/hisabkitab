/* global require, module, process */

const mongoose = require("mongoose");

let connectionPromise = null;

function connectDatabase() {
    if (mongoose.connection.readyState === 1) return Promise.resolve();
    if (connectionPromise) return connectionPromise;

    if (!process.env.MONGO_URI) {
        return Promise.reject(new Error("MONGO_URI must be configured."));
    }

    connectionPromise = mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
    })
        .then(() => {
            connectionPromise = null;
        })
        .catch((error) => {
            connectionPromise = null;
            throw error;
        });

    return connectionPromise;
}

module.exports = { connectDatabase };
