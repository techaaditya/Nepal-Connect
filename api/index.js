// Vercel serverless entrypoint wrapping the existing Express app
const serverless = require('serverless-http');
const app = require('../backend/server');

module.exports = serverless(app);
