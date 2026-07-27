import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { v2 as cloudinary } from 'cloudinary';

import {
  CommitteeMember,
  DirectoryMember,
  GalleryItem,
  EventScheduleItem,
  HistoryMilestone,
  SocialActivity,
  Sponsor,
  Announcement
} from './models/index.js';

import {
  INITIAL_COMMITTEE,
  INITIAL_MEMBERS,
  INITIAL_GALLERY,
  INITIAL_EVENTS,
  INITIAL_MILESTONES,
  INITIAL_SOCIAL_ACTIVITIES,
  INITIAL_SPONSORS,
  INITIAL_ANNOUNCEMENTS
} from '../src/data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(url: string | undefined): Promise<string> {
  if (!url) return '';
  if (url.includes('cloudinary.com')) return url; // Already on Cloudinary
  if (url.includes('instagram.com')) return url; // Don't upload IG reels

  try {
    let uploadPath = url;
    if (url.startsWith('/images/')) {
      uploadPath = path.join(__dirname, '../public', url);
    }
    
    console.log(`Uploading ${url.substring(0, 50)}... to Cloudinary`);
    const result = await cloudinary.uploader.upload(uploadPath, {
      folder: 'taqdeer-mandal-seed',
      resource_type: 'auto'
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload image ${url}:`, error);
    return url; // fallback to original if upload fails
  }
}

async function seed() {
  try {
    console.log(`Connecting to MongoDB...`);
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI not found');

    await mongoose.connect(uri);
    console.log(`Connected to Database: ${mongoose.connection.db?.databaseName}`);

    console.log('Clearing existing collections...');
    await Promise.all([
      CommitteeMember.deleteMany({}),
      DirectoryMember.deleteMany({}),
      GalleryItem.deleteMany({}),
      EventScheduleItem.deleteMany({}),
      HistoryMilestone.deleteMany({}),
      SocialActivity.deleteMany({}),
      Sponsor.deleteMany({}),
      Announcement.deleteMany({})
    ]);

    console.log('Collections cleared. Starting seed process...');

    // 1. Announcements
    console.log(`Seeding ${INITIAL_ANNOUNCEMENTS.length} Announcements...`);
    await Announcement.insertMany(INITIAL_ANNOUNCEMENTS);

    // 2. Events
    console.log(`Seeding ${INITIAL_EVENTS.length} Events...`);
    await EventScheduleItem.insertMany(INITIAL_EVENTS);

    // 3. Committee
    console.log(`Seeding ${INITIAL_COMMITTEE.length} Committee Members...`);
    const committeePromises = INITIAL_COMMITTEE.map(async (member) => {
      const photoUrl = await uploadToCloudinary(member.photoUrl);
      return { ...member, photoUrl };
    });
    const committeeData = await Promise.all(committeePromises);
    await CommitteeMember.insertMany(committeeData);

    // 4. Directory
    console.log(`Seeding ${INITIAL_MEMBERS.length} Directory Members...`);
    const directoryPromises = INITIAL_MEMBERS.map(async (member) => {
      const photoUrl = await uploadToCloudinary(member.photoUrl);
      return { ...member, photoUrl };
    });
    const directoryData = await Promise.all(directoryPromises);
    await DirectoryMember.insertMany(directoryData);

    // 5. Gallery
    console.log(`Seeding ${INITIAL_GALLERY.length} Gallery Items...`);
    const galleryPromises = INITIAL_GALLERY.map(async (item) => {
      const imageUrl = await uploadToCloudinary(item.imageUrl);
      return { ...item, imageUrl };
    });
    const galleryData = await Promise.all(galleryPromises);
    await GalleryItem.insertMany(galleryData);

    // 6. History
    console.log(`Seeding ${INITIAL_MILESTONES.length} History Milestones...`);
    const historyPromises = INITIAL_MILESTONES.map(async (item) => {
      const imageUrl = await uploadToCloudinary(item.imageUrl);
      return { ...item, imageUrl };
    });
    const historyData = await Promise.all(historyPromises);
    await HistoryMilestone.insertMany(historyData);

    // 7. Social Activities
    console.log(`Seeding ${INITIAL_SOCIAL_ACTIVITIES.length} Social Activities...`);
    const socialPromises = INITIAL_SOCIAL_ACTIVITIES.map(async (item) => {
      const imageUrl = await uploadToCloudinary(item.imageUrl);
      return { ...item, imageUrl };
    });
    const socialData = await Promise.all(socialPromises);
    await SocialActivity.insertMany(socialData);

    // 8. Sponsors
    console.log(`Seeding ${INITIAL_SPONSORS.length} Sponsors...`);
    const sponsorPromises = INITIAL_SPONSORS.map(async (item) => {
      const logoUrl = await uploadToCloudinary(item.logoUrl);
      return { ...item, logoUrl };
    });
    const sponsorData = await Promise.all(sponsorPromises);
    await Sponsor.insertMany(sponsorData);

    console.log('✅ Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seed();
