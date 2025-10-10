import { httpRequestCounter, httpRequestDuration } from "../observe/promClient.js";

export default function observeMiddleware(req, res, next) {
    const end = httpRequestDuration.startTimer();
    res.on('finish', () => {
        httpRequestCounter.inc({
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.status
        });
        end({
            method: req.method,
            route: req.route?.path || req.path,
            status_code: res.status
        });
    });
    next();
}