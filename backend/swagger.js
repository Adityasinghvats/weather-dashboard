import swaggerJSDoc from 'swagger-jsdoc';

const definition = {
    openapi: '3.0.0',
    info: {
        title: 'Weather Backend API',
        version: '1.0.0',
        description: 'API documentation for Weather Dashboard backend',
    },
    servers: [
        {
            url: 'http://localhost:' + (process.env.PORT || 3000),
            description: 'Local server',
        },
    ],
};

const options = {
    definition,
    apis: ['./routers/*.js', './controllers/*.js', './models/*.js'],
};

export const swaggerSpec = swaggerJSDoc(options);
