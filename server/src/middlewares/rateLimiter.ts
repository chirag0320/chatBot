import rateLimit from 'express-rate-limit';

// General API limiter (default for all routes)
export const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 50,                 // 50 requests per 1 mins
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: 'Too many requests, please try again later.',
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for login / auth routes
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // max 5 login attempts per window
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json({
      success: false,
      message: `Too many login attempts. Try again in ${options.windowMs / 1000 / 60} minute(s).`,
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
