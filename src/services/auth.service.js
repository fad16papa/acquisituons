import logger from '#config/logger.js';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '#config/database.js';
import { users } from '#models/user.model.js';

export const hashPassword = async password => {
  // Implement password hashing logic here (e.g., using bcrypt)
  try {
    return await bcrypt.hash(password, 10);
  } catch (e) {
    logger.error('Error hashing password', e);
    throw new Error('Password hashing failed');
  }
};

export const createUser = async ({ name, email, password, role }) => {
  // Implement user creation logic here (e.g., saving to a database)
  // This is a mock implementation; replace it with actual database logic
  try {
    const existingUser = db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    return newUser;
  } catch (e) {
    logger.error('Error creating user', e);
    throw new Error('User creation failed', e);
  }
};
