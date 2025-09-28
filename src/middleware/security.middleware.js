import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';

const securityMiddleware = (req, res, next) => {
  try {
    const role = req.user?.role || 'guest';

    let limit;
    let message;

    switch (role) {
      case 'admin':
        limit = 20; // High limit for admin users
        message = 'Admin request limit execeeded (20 per minuite). Slow down!';
        break;
      case 'user':
        limit = 10; // Moderate limit for regular users
        message = 'User request limit execeeded (10 per minuite). Slow down!';
        break;
      case 'guest':
        limit = 5; // Low limit for guests or unauthenticated users
        message = 'Guest request limit execeeded (5 per minuite). Slow down!';
        break;
    }
    const client = aj.withRule(
      slidingWindow({
        mode: 'LIVE',
        interval: '1m',
        max: limit,
        name: `${role}-rate-limit`,
      })
    );

    const decision = await client.protect(req);
  } catch (e) {
    console.log('Arcjet middleware error', e);
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong with the security middleware',
    });
  }
};
