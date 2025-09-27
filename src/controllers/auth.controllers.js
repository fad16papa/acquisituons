import logger from '#config/logger.js';
import { signUpSchema } from '#validations/auth.validations.js';
import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import jwttoken from 'jsonwebtoken';

export const signup = async (req, res, next) => {
  try {
    const validationResult = signUpSchema.safeParse(req.body);

    if (validationResult.error) {
      return res.status(400).json({
        error: 'Validation Failed',
        details: validationResult.error.format(),
      });
    }

    const { name, email, password, role } = validationResult.data;

    //AUTH Service
    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN,
      }
    );

    cookies.set(res, 'token', token);

    logger.info(`User ${email} signed up successfully as ${role}`);
    res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (e) {
    logger.error('Signup error', e);

    if (e.message === 'User already exists') {
      return res.status(409).json({ message: e.message });
    }

    next(e);
  }
};
