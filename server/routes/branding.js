const app = require('express').Router();
const fs = require('fs');
const path = require('path');
const {brandingFolder} = require("../utils/file");
const {isSetupComplete} = require("../utils/auth");

const readBranding = (fileName) => {
    const file = fs.readFileSync(path.join(brandingFolder, fileName));
    return Buffer.from(file).toString('base64');
}

const brandingPayload = require(path.join(brandingFolder, "branding.json"));
const packageJson = require("../../package.json");

app.get('/', (req, res) => {
    res.json({
        logo: readBranding("logo.png"),
        title: readBranding("title.png"),
        ...brandingPayload,
        setupComplete: isSetupComplete(),
        version: packageJson.version
    });
});

module.exports = app;