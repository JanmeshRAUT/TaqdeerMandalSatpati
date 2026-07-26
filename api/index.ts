import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import connectDB from './config/db.js';
import {
  Announcement, CommitteeMember, DirectoryMember, GalleryItem,
  EventScheduleItem, HistoryMilestone, SocialActivity, Sponsor
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

// Serve uploads statically
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

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

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
