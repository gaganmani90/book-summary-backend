const swaggerAutogen = require('swagger-autogen');
const endpoints = [
    './src/routes/profile.router.ts',
    './src/routes/ask.router.ts',
    './src/routes/openai.query.router.ts',
    './src/routes/auth.router.ts']
const outputFile = './swagger-output.json'

swaggerAutogen(outputFile, endpoints);
