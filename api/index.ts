import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from './config/db.js';
import {
  Announcement, CommitteeMember, DirectoryMember, GalleryItem,
  EventScheduleItem, HistoryMilestone, SocialActivity, Sponsor, JerseyBooking, Settings, DonationRecord, FinanceRecord
} from './models/index.js';
import nodemailer from 'nodemailer';
import { numberToMarathiWords } from './utils/numberToMarathiWords.js';
import {
  INITIAL_ANNOUNCEMENTS, INITIAL_COMMITTEE, INITIAL_MEMBERS,
  INITIAL_GALLERY, INITIAL_EVENTS, INITIAL_MILESTONES,
  INITIAL_SOCIAL_ACTIVITIES, INITIAL_SPONSORS
} from '../src/data/initialData.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB asynchronously in the background
connectDB().catch(err => console.error('Initial DB connection error:', err));

// CORS options setup to restrict access in production
const corsOptions = {
  origin: (origin: any, callback: any) => {
    // Allow same-origin requests or server-to-server requests
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      process.env.APP_URL,
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
      'https://taqdeer-mandal-satpati.vercel.app'
    ].filter(Boolean);

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed === origin) return true;
      try {
        const allowedHost = new URL(allowed).hostname;
        const originHost = new URL(origin).hostname;
        return originHost === allowedHost || originHost.endsWith('.' + allowedHost);
      } catch (e) {
        return false;
      }
    });

    if (isAllowed || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Middleware to guarantee that MongoDB connection is ready before processing API queries
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err: any) {
    console.error('Database connection failed in middleware:', err);
    res.status(500).json({ message: 'Database connection failed: ' + err.message });
  }
});

// Auth Utilities
const getAdminPin = () => process.env.ADMIN_PIN || 'Taqdeer1981';

const isAdmin = (req: express.Request): boolean => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  const token = authHeader.substring(7);
  return token === getAdminPin();
};

const requireAdmin = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (!isAdmin(req)) {
    return res.status(401).json({ message: 'Unauthorized: Admin access required' });
  }
  next();
};

// Vercel read-only filesystem fix: Removed local /uploads directory creation.
// We are using memoryStorage and Base64 Data URIs, so local disk storage is not required.
// Configure Multer for memory storage (converts to Base64)
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit for video uploads on Render
});

// Seed Database if empty
const seedDatabase = async () => {
  try {
    await connectDB();
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
// Removed automatic seeding in production to prevent Vercel MongoBulkWriteErrors
// seedDatabase();

// --- API Routes ---

// Auth Verification Route
app.post('/api/auth/verify', (req, res) => {
  const { pin } = req.body;
  if (!pin) {
    return res.status(400).json({ success: false, message: 'PIN is required' });
  }
  if (pin === getAdminPin()) {
    return res.json({ success: true });
  }
  res.status(401).json({ success: false, message: 'Invalid PIN' });
});

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  // It will automatically pick up CLOUDINARY_URL
  cloudinary.config(true);
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Image Upload Route - Requires Admin Auth
app.post('/api/upload', requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  
  // Upload buffer to Cloudinary using upload_stream
  const uploadStream = cloudinary.uploader.upload_stream(
    { folder: 'taqdeer-mandal', resource_type: 'auto' },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
      }
      res.json({ url: result?.secure_url });
    }
  );

  uploadStream.end(req.file.buffer);
});

// Global Settings Route
app.get('/api/settings', async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/settings', requireAdmin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(req.body);
    } else {
      const updateData = { ...req.body };
      delete updateData._id;
      delete updateData.__v;
      
      settings = await Settings.findOneAndUpdate(
        { _id: settings._id },
        { $set: updateData, updatedAt: new Date() },
        { returnDocument: 'after' }
      );
    }
    res.json(settings);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

const createRouter = (Model: any) => {
  const router = express.Router();
  
  // GET: Public read, but masks/redacts PII if not admin
  router.get('/', async (req, res) => {
    try {
      const data = await Model.find();
      const isUserAdmin = isAdmin(req);
      
      if (!isUserAdmin) {
        if (Model.modelName === 'DirectoryMember') {
          const sanitized = data.map((item: any) => {
            const doc = item.toObject();
            // Mask phone number (e.g. +91 ********56)
            if (doc.phone) {
              const phoneStr = String(doc.phone);
              doc.phone = phoneStr.length > 4 
                ? phoneStr.substring(0, 3) + '*****' + phoneStr.substring(phoneStr.length - 2)
                : '*****';
            }
            // Omit bloodGroup for non-admin
            delete doc.bloodGroup;
            return doc;
          });
          return res.json(sanitized);
        }
        
        if (Model.modelName === 'JerseyBooking') {
          const sanitized = data.map((item: any) => {
            const doc = item.toObject();
            // Omit address and phone completely from public view
            delete doc.address;
            delete doc.phone;
            return doc;
          });
          return res.json(sanitized);
        }

        if (Model.modelName === 'DonationRecord') {
          const sanitized = data.map((item: any) => {
            const doc = item.toObject();
            delete doc.phone;
            delete doc.email;
            delete doc.transactionId;
            return doc;
          });
          return res.json(sanitized);
        }
      }
      
      res.json(data);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // POST: Enforces auth for all except public JerseyBooking & DonationRecord creation
  router.post('/', async (req, res) => {
    try {
      const isUserAdmin = isAdmin(req);
      
      if (Model.modelName === 'DonationRecord') {
        const { id, name, email, phone, amount, transactionId, date, status, address, details } = req.body;
        
        if (!name || !amount) {
          return res.status(400).json({ message: 'Missing required donation fields.' });
        }
        
        const finalStatus = isUserAdmin && status ? status : 'Pending';
        
        // Auto-increment receiptNo logic
        const lastDonation = await Model.findOne({ receiptNo: { $regex: /^TQM-/ } }).sort({ receiptNo: -1 });
        let nextReceiptNum = 1;
        if (lastDonation && lastDonation.receiptNo) {
          const lastNum = parseInt(lastDonation.receiptNo.replace('TQM-', ''), 10);
          if (!isNaN(lastNum)) nextReceiptNum = lastNum + 1;
        }
        const generatedReceiptNo = `TQM-${String(nextReceiptNum).padStart(4, '0')}`;
        
        const cleanDonation = {
          id: id || 'don-' + Date.now(),
          receiptNo: generatedReceiptNo,
          name: String(name).trim(),
          email: email ? String(email).trim() : '',
          phone: phone ? String(phone).trim() : '',
          address: address ? String(address).trim() : '',
          details: details ? String(details).trim() : 'देणगी',
          amount: String(amount),
          transactionId: transactionId ? String(transactionId).trim() : `OFFLINE-${Date.now()}`,
          date: date || new Date().toISOString(),
          status: finalStatus
        };
        
        const newItem = new Model(cleanDonation);
        const savedItem = await newItem.save();
        
        // Sync to Google Sheets asynchronously
        if (savedItem) {
          import('./utils/googleSheets.js').then(({ appendToGoogleSheet }) => {
            const row = [
              savedItem.date,
              savedItem.receiptNo || '',
              savedItem.name || '',
              savedItem.email || '',
              savedItem.phone || '',
              savedItem.address || '',
              savedItem.details || '',
              savedItem.amount || '',
              savedItem.status || '',
              savedItem.transactionId || ''
            ];
            appendToGoogleSheet('Donations!A:J', [row]);
          }).catch(err => console.error('Failed to import googleSheets:', err));
        }
        
        return res.status(201).json(savedItem);
      }
      
      if (Model.modelName === 'JerseyBooking') {
        const { id, name, address, phone, items, bookingDate, status } = req.body;
        
        // Strict input validation
        if (!name || !address || !phone || !items || !Array.isArray(items) || items.length === 0) {
          return res.status(400).json({ message: 'Missing required booking fields or empty items.' });
        }
        
        // Public cannot verify bookings, force 'Pending' status. Admins can specify status.
        const finalStatus = isUserAdmin && status ? status : 'Pending';
        
        const cleanBooking = {
          id: id || 'jb-' + Date.now(),
          name: String(name).trim().substring(0, 100),
          address: String(address).trim().substring(0, 500),
          phone: String(phone).trim().substring(0, 20),
          items: items.map((itm: any) => ({
            id: itm.id || String(Date.now() + Math.random()),
            size: Number(itm.size),
            sleeveType: String(itm.sleeveType),
            quantity: Math.max(1, Math.min(50, Number(itm.quantity) || 1))
          })),
          bookingDate: bookingDate || new Date().toISOString(),
          status: finalStatus
        };
        
        const newItem = new Model(cleanBooking);
        const savedItem = await newItem.save();

        // Sync to Google Sheets asynchronously
        if (savedItem) {
          import('./utils/googleSheets.js').then(({ appendToGoogleSheet }) => {
            const rows = savedItem.items.map((itm: any) => [
              savedItem.id,
              savedItem.name || '',
              savedItem.phone || '',
              savedItem.address || '',
              new Date(savedItem.bookingDate || Date.now()).toLocaleDateString(),
              savedItem.status || '',
              itm.size,
              itm.sleeveType,
              itm.quantity
            ]);
            appendToGoogleSheet('Bookings!A:I', rows);
          }).catch(err => console.error('Failed to import googleSheets:', err));
        }

        return res.status(201).json(savedItem);
      }
      
      // All other resource creates require Admin auth
      if (!isUserAdmin) {
        return res.status(401).json({ message: 'Unauthorized: Admin access required' });
      }
      
      const newItem = new Model(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // DELETE: Always require admin auth
  router.delete('/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const result = await Model.findOneAndDelete({ id: id });
      if (!result) return res.status(404).json({ message: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });
  
  // PUT: Always require admin auth
  router.put('/:id', requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Keep track of old status if it's a DonationRecord
      let oldDoc = null;
      if (Model.modelName === 'DonationRecord') {
        oldDoc = await Model.findOne({ id: id });
      }

      const result = await Model.findOneAndUpdate({ id: id }, req.body, { returnDocument: 'after' });
      if (!result) return res.status(404).json({ message: 'Not found' });

      // Sync status update to Google Sheets
      if (req.body.status) {
        import('./utils/googleSheets.js').then(({ updateStatusInGoogleSheet }) => {
          if (Model.modelName === 'JerseyBooking') {
            updateStatusInGoogleSheet('Bookings', id, req.body.status);
          } else if (Model.modelName === 'DonationRecord') {
            // Find by receiptNo or transactionId
            const searchId = result.receiptNo || result.transactionId || id;
            updateStatusInGoogleSheet('Donations', searchId, req.body.status);
          }
        }).catch(err => console.error('Failed to import googleSheets for update:', err));
      }

      // If it's a DonationRecord and status changed to 'Verified', we just return the result.
      // The email sending is now handled by POST /:id/send-receipt.

      res.json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // POST: Send Email Receipt (only for DonationRecord)
  router.post('/:id/send-receipt', requireAdmin, async (req, res) => {
    if (Model.modelName !== 'DonationRecord') {
      return res.status(404).json({ message: 'Route not found' });
    }
    try {
      const { id } = req.params;
      const { imageData } = req.body;
      if (!imageData) {
        return res.status(400).json({ message: 'Image data is required' });
      }

      const result = await Model.findOne({ id: id });
      if (!result) return res.status(404).json({ message: 'Donation not found' });
      if (!result.email) return res.status(400).json({ message: 'Donation does not have an email' });

      // Received html2canvas generated JPEG from frontend
      const base64Data = imageData.replace(/^data:image\/jpeg;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Spam-proof plain text body
      const textContent = `सप्रेम नमस्कार ${result.name},\n\nतकदीर मित्र मंडळ, सातपाटी यांस आपण दिलेल्या रुपये ${result.amount}/- च्या देणगीबद्दल आम्ही आपले अत्यंत आभारी आहोत.\n\nतुमची अधिकृत देणगी पावती या ईमेलसोबत जोडलेली आहे.\n\nश्री गणेशाच्या कृपेने तुम्हाला सुख, शांती आणि समृद्धी लाभो हीच सदिच्छा.\n\nआपले नम्र,\nतकदीर मित्र मंडळ, सातपाटी\nश्रद्धा • सेवा • संस्कृती`;

      const attachment = {
        filename: `Donation_Receipt_${result.receiptNo || result.transactionId}.jpg`,
        content: imageBuffer,
        contentType: 'image/jpeg'
      };

      let emailSent = false;

      // 1. Try Resend First
      if (process.env.RESEND_API_KEY) {
        try {
          const resendTransporter = nodemailer.createTransport({
            host: 'smtp.resend.com',
            port: 465,
            secure: true,
            auth: { user: 'resend', pass: process.env.RESEND_API_KEY }
          });
          const fromAddress = process.env.EMAIL_FROM || 'onboarding@resend.dev';
          
          await resendTransporter.sendMail({
            from: `"Taqdeer Mitra Mandal" <${fromAddress}>`,
            to: result.email,
            subject: 'देणगी पावती - तकदीर मित्र मंडळ, सातपाटी (Donation Receipt)',
            text: textContent,
            attachments: [attachment]
          });
          console.log('Receipt email sent via Resend to:', result.email);
          emailSent = true;
        } catch (resendErr) {
          console.error('Resend failed, attempting fallback to Gmail...', (resendErr as any).message);
        }
      }

      // 2. Fallback to Gmail if Resend failed (or wasn't configured)
      if (!emailSent && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        try {
          const gmailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
          });
          
          await gmailTransporter.sendMail({
            from: `"Taqdeer Mitra Mandal" <${process.env.EMAIL_USER}>`,
            to: result.email,
            subject: 'देणगी पावती - तकदीर मित्र मंडळ, सातपाटी (Donation Receipt)',
            text: textContent,
            attachments: [attachment]
          });
          console.log('Receipt email sent via Gmail Fallback to:', result.email);
          emailSent = true;
        } catch (gmailErr) {
          console.error('Gmail Fallback failed:', (gmailErr as any).message);
        }
      }

      if (!emailSent) {
        console.log('Skipping email receipt: Both Resend and Gmail fallback failed or are not configured.');
        return res.status(500).json({ message: 'Email configuration missing or sending failed' });
      }

      res.json({ message: 'Receipt sent successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
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
app.use('/api/donations', createRouter(DonationRecord));
app.use('/api/finance', createRouter(FinanceRecord));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

