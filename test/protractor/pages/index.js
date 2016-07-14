var pages = global.bedrock.pages || {};

pages.credential = pages.credential || {};
pages.credential.credentialViewer = require('./credential');
pages.credential.credentialList = require('./credential-list');

module.exports = global.bedrock.pages = pages;
