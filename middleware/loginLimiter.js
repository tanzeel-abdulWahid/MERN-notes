import rateLimit from 'express-rate-limit';
import { logEvents } from "./logger.js";


//Use to limit repeated requests to public APIs and/or endpoints such as password reset
export const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
	max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
	message:
		'Too many accounts created from this IP, please try again after an hour',
    handler: (request, response, next, options) => {
        logEvents(`Too Many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
        response.status(options.statusCode).send(options.message)
    },
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})