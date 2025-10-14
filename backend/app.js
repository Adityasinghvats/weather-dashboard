import express from "express";
import cors from "cors";
import dataRouter from "./routers/data.router.js";
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './swagger.js';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { errorHandler } from "./middlewares/error.middleware.js";
import observeMiddleware from "./middlewares/observe.middleware.js";
import { register } from "./observe/promClient.js";

dotenv.config({
    path: './.env'
})

const app = express();

// Ensure correct protocol/host when behind a proxy (e.g., Render, Heroku, Nginx)
app.set('trust proxy', 1);

const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(
    cors(corsOptions)
)
// Security middleware
app.use(helmet());
app.disable('x-powered-by');

app.use(express.json({ limit: "16kb" }));
// allow data in url encoded format 
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
// serving assets like images , css
app.use(express.static("public"))
app.use(observeMiddleware);

// Swagger docs (dynamic servers based on request)
app.get('/api-docs.json', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const spec = { ...swaggerSpec, servers: [{ url: baseUrl }] };
    res.setHeader('Content-Type', 'application/json');
    res.send(spec);
});

// add flag or auth for api-docs endpoint in production
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(undefined, {
    swaggerOptions: { url: '/api-docs.json' }
}));

// metrics endpoint
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
})

app.use("/api/v1/", dataRouter);
app.use(errorHandler);

export default app;