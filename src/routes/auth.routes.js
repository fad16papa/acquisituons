import { signup } from '#controllers/auth.controllers.js';
import express from 'express';

const router = express.Router();

router.post('/sign-up', signup);

router.post('/sign-in', (req, res) => {
  // Handle user sign-in
  res.send('POST /api/auth/sign-in endpoint');
});

router.post('/sign-out', (req, res) => {
  // Handle user sign-out
  res.send('POST /api/auth/sign-out endpoint');
});

export default router;
