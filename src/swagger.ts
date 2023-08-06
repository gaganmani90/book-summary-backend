const swaggerAutogen = require('swagger-autogen')({openapi: '3.0.0'});
const doc = {
    info: {
        title: 'Smart Book Summary API',
        description: 'Smart Book Summary API',
    },
    host: 'localhost:8080',
    schemes: ['http'],
};
const endpoints = [
    './src/routes/profile.router.ts',
    './src/routes/ask.router.ts',
    './src/routes/openai.query.router.ts',
    './src/routes/auth.router.ts']
const outputFile = './swagger-output.json'

swaggerAutogen(outputFile, endpoints, doc);