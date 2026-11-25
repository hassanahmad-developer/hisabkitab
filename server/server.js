/* global require, process */

const app = require("./app");
const { connectDatabase } = require("./db");

const port = Number(process.env.PORT) || 5000;

connectDatabase()
    .then(() => app.listen(port, () => console.log("API running on", port)))
    .catch((e) => {
        console.error("Mongo error:", e.message);
        process.exit(1);
    });