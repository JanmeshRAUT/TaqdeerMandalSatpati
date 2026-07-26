import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './api/config/db.js';
import { EventScheduleItem } from './api/models/index.js';
import { INITIAL_EVENTS } from './src/data/initialData.js';

dotenv.config();

const resetEvents = async () => {
  try {
    await connectDB();
    console.log('Connected to DB. Clearing Events...');
    await EventScheduleItem.deleteMany({});
    console.log('Events cleared. Seeding 9-Day Festival schedule...');
    await EventScheduleItem.insertMany(INITIAL_EVENTS);
    console.log('Successfully seeded events!');
    process.exit(0);
  } catch (error) {
    console.error('Error resetting events:', error);
    process.exit(1);
  }
};

resetEvents();
