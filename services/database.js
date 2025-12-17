import { MongoClient, ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

let client;
let db;

// Initialize MongoDB connection
export async function connectToDatabase() {
  if (db) return { client, db };

  const mongoUri = process.env.MONGODB_URI;
  console.log('MongoDB URI check:', mongoUri ? 'Found' : 'Missing');
  
  if (!mongoUri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db('spotlight');
    console.log('Connected to MongoDB - Database: spotlight');
    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

// User Authentication Functions
export async function createUser(userData) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');

  // Check if user already exists
  const existingUser = await users.findOne({ email: userData.email });
  if (existingUser) {
    throw new Error('User already exists with this email');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12);

  // Create user document
  const newUser = {
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    isGuest: false,
    createdAt: new Date(),
    savedBusinesses: []
  };

  const result = await users.insertOne(newUser);
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return { ...userWithoutPassword, id: result.insertedId.toString() };
}

export async function authenticateUser(email, password) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');

  const user = await users.findOne({ email });
  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    throw new Error('Invalid credentials');
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id.toString(), email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Return user without password
  const { password: _, ...userWithoutPassword } = user;
  return { 
    user: { ...userWithoutPassword, id: user._id.toString() }, 
    token 
  };
}

export async function getUserById(userId) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');
  
  const user = await users.findOne({ _id: new ObjectId(userId) });
  if (!user) return null;

  const { password, ...userWithoutPassword } = user;
  return { ...userWithoutPassword, id: user._id.toString() };
}

// Saved Businesses Functions
export async function saveBusinessForUser(userId, business) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');

  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    { 
      $addToSet: { 
        savedBusinesses: {
          ...business,
          savedAt: new Date()
        }
      }
    }
  );

  return result.modifiedCount > 0;
}

export async function removeSavedBusinessForUser(userId, businessId) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');

  const result = await users.updateOne(
    { _id: new ObjectId(userId) },
    { 
      $pull: { 
        savedBusinesses: { id: businessId }
      }
    }
  );

  return result.modifiedCount > 0;
}

export async function getUserSavedBusinesses(userId) {
  const { db } = await connectToDatabase();
  const users = db.collection('users');

  const user = await users.findOne(
    { _id: new ObjectId(userId) },
    { projection: { savedBusinesses: 1 } }
  );

  return user?.savedBusinesses || [];
}

// JWT Verification Middleware
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}