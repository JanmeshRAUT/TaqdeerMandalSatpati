import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Razorpay from 'razorpay';
import connectDB from './config/db.js';
import {
  Announcement, CommitteeMember, DirectoryMember, GalleryItem,
  EventScheduleItem, HistoryMilestone, SocialActivity, Sponsor, JerseyBooking
} from './models/index.js';
import {
  INITIAL_ANNOUNCEMENTS, INITIAL_COMMITTEE, INITIAL_MEMBERS,
  INITIAL_GALLERY, INITIAL_EVENTS, INITIAL_MILESTONES,
  INITIAL_SOCIAL_ACTIVITIES, INITIAL_SPONSORS
} from '../src/data/initialData.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Vercel read-only filesystem fix: Removed local /uploads directory creation.
// We are using memoryStorage and Base64 Data URIs, so local disk storage is not required.
// Configure Multer for memory storage (converts to Base64)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit to prevent huge base64 strings
});

// Seed Database if empty
const seedDatabase = async () => {
  try {
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
      await Announcement.insertMany(INITIAL_ANNOUNCEMENTS);
      await CommitteeMember.insertMany(INITIAL_COMMITTEE);
      await DirectoryMember.insertMany(INITIAL_MEMBERS);
      await GalleryItem.insertMany(INITIAL_GALLERY);
      await EventScheduleItem.insertMany(INITIAL_EVENTS);
      await HistoryMilestone.insertMany(INITIAL_MILESTONES);
      await SocialActivity.insertMany(INITIAL_SOCIAL_ACTIVITIES);
      await Sponsor.insertMany(INITIAL_SPONSORS);
      console.log('Database seeded with initial data.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
seedDatabase();

// --- API Routes ---

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummykeyid123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummysecretkey456',
});

// Create Razorpay Order
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt = 'receipt_123' } = req.body;
    const options = {
      amount: amount * 100, // amount in smallest currency unit (paise for INR)
      currency,
      receipt
    };
    
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error("Razorpay error:", error);
    res.status(500).json({ message: 'Error creating razorpay order', error });
  }
});

// Image Upload Route
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Convert to Base64 and return as a Data URI to be saved in MongoDB
  const base64Data = req.file.buffer.toString('base64');
  const fileUrl = `data:${req.file.mimetype};base64,${base64Data}`;
  
  res.json({ url: fileUrl });
});

const createRouter = (Model: any) => {
  const router = express.Router();
  router.get('/', async (req, res) => {
    try {
      const data = await Model.find();
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.post('/', async (req, res) => {
    try {
      const newItem = new Model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Model.findOneAndDelete({ id: id });
      if (!result) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  router.put('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Model.findOneAndUpdate({ id: id }, req.body, { new: true });
      if (!result) return res.status(404).json({ message: 'Not found' });
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  return router;
};

app.use('/api/announcements', createRouter(Announcement));
app.use('/api/committee', createRouter(CommitteeMember));
app.use('/api/members', createRouter(DirectoryMember));
app.use('/api/gallery', createRouter(GalleryItem));
app.use('/api/events', createRouter(EventScheduleItem));
app.use('/api/milestones', createRouter(HistoryMilestone));
app.use('/api/activities', createRouter(SocialActivity));
app.use('/api/sponsors', createRouter(Sponsor));
app.use('/api/jersey-bookings', createRouter(JerseyBooking));

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
