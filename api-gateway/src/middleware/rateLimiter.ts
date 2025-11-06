import rateLimit from 'express-rate-limit';
import config from '../config';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimitWindowMS,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      errorMessage: {
        path: req.originalUrl,
        message:
          'Too many requests from this IP, please try again after sometime.',
      },
    });
  },
});

export const authLimiter = rateLimit({
  windowMs: config.rateLimitWindowMS,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: 'Too many requests',
      errorMessage: {
        path: req.originalUrl,
        message:
          'Too many requests from this IP, please try again after sometime.',
      },
    });
  },
});
