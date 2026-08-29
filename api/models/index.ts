import mongoose, { Schema } from 'mongoose';

const CommitteeMemberSchema = new Schema({
  id: { type: String, required: true, unique: true },
  nameMr: { type: String, required: true },
  nameEn: { type: String, required: true },
  roleMr: { type: String, required: true },
  roleEn: { type: String, required: true },
  photoUrl: String,
  phone: String,
  bioMr: String,
  bioEn: String,
  order: { type: Number, required: true },
  termYear: { type: String, required: true }
});

const DirectoryMemberSchema = new Schema({
  id: { type: String, required: true, unique: true },
  nameMr: { type: String, required: true },
  nameEn: { type: String, required: true },
  joinedYear: { type: Number, required: true },
  bloodGroup: String,
  phone: String,
  locationMr: String,
  locationEn: String,
  photoUrl: String,
  isLifetimeMember: Boolean
});

const GalleryItemSchema = new Schema({
  id: { type: String, required: true, unique: true },
  titleMr: { type: String, required: true },
  titleEn: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  year: { type: Number, required: true },
  descriptionMr: String,
  descriptionEn: String,
  isHeroPinned: { type: Boolean, default: false }
});

const EventScheduleItemSchema = new Schema({
  id: { type: String, required: true, unique: true },
  titleMr: { type: String, required: true },
  titleEn: { type: String, required: true },
  date: { type: String, required: true },
  timeMr: { type: String, required: true },
  timeEn: { type: String, required: true },
  categoryMr: { type: String, required: true },
  categoryEn: { type: String, required: true },
  locationMr: { type: String, required: true },
  locationEn: { type: String, required: true },
  descriptionMr: String,
  descriptionEn: String,
  isImportant: Boolean
});

const HistoryMilestoneSchema = new Schema({
  id: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  titleMr: { type: String, required: true },
  titleEn: { type: String, required: true },
  descriptionMr: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  imageUrl: String
});

const SocialActivitySchema = new Schema({
  id: { type: String, required: true, unique: true },
  titleMr: { type: String, required: true },
  titleEn: { type: String, required: true },
  descriptionMr: { type: String, required: true },
  descriptionEn: { type: String, required: true },
  dateMr: { type: String, required: true },
  dateEn: { type: String, required: true },
  impactStatMr: { type: String, required: true },
  impactStatEn: { type: String, required: true },
  imageUrl: { type: String, required: true }
});

const SponsorSchema = new Schema({
  id: { type: String, required: true, unique: true },
  nameMr: { type: String, required: true },
  nameEn: { type: String, required: true },
  amountOrTypeMr: { type: String, required: true },
  amountOrTypeEn: { type: String, required: true },
  year: { type: Number, required: true },
  logoUrl: String
});

const AnnouncementSchema = new Schema({
  id: { type: String, required: true, unique: true },
  textMr: { type: String, required: true },
  textEn: { type: String, required: true },
  linkSection: String,
  isActive: { type: Boolean, required: true },
  date: { type: String, required: true }
});

const JerseyBookingItemSchema = new Schema({
  id: { type: String, required: true },
  size: { type: Number, required: true },
  sleeveType: { type: String, required: true },
  quantity: { type: Number, required: true }
});

const JerseyBookingSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: false },
  paymentMode: { type: String, required: false },
  items: [JerseyBookingItemSchema],
  bookingDate: { type: String, required: true },
  status: { type: String, default: 'Pending' } // 'Pending' or 'Verified'
});

const DonationRecordSchema = new Schema({
  id: { type: String, required: true, unique: true },
  receiptNo: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, default: '' },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  details: { type: String, default: 'देणगी' },
  amount: { type: String, required: true },
  transactionId: { type: String, required: true },
  date: { type: String, required: true },
  status: { type: String, default: 'Pending' }
});

export const CommitteeMember = mongoose.model('CommitteeMember', CommitteeMemberSchema);
export const DirectoryMember = mongoose.model('DirectoryMember', DirectoryMemberSchema);
export const GalleryItem = mongoose.model('GalleryItem', GalleryItemSchema);
export const EventScheduleItem = mongoose.model('EventScheduleItem', EventScheduleItemSchema);
export const HistoryMilestone = mongoose.model('HistoryMilestone', HistoryMilestoneSchema);
export const SocialActivity = mongoose.model('SocialActivity', SocialActivitySchema);
export const Sponsor = mongoose.model('Sponsor', SponsorSchema);
export const Announcement = mongoose.model('Announcement', AnnouncementSchema);
export const JerseyBooking = mongoose.model('JerseyBooking', JerseyBookingSchema);
export const DonationRecord = mongoose.model('DonationRecord', DonationRecordSchema);

const SettingsSchema = new Schema({
  heroTitleMr: { type: String, default: 'श्री सार्वजनिक गणेशोत्सव' },
  heroTitleEn: { type: String, default: 'Shree Sarvajanik Ganeshotsav' },
  heroSubtitleMr: { type: String, default: 'तकदीर मित्र मंडळ, सातपाटी' },
  heroSubtitleEn: { type: String, default: 'Taqdeer Mitra Mandal, Satpati' },
  isHeroSlideshowEnabled: { type: Boolean, default: false },
  heroVideoUrl: { type: String, default: '' },
  heroImageUrl: { type: String, default: '' },
  isJerseyRegistrationOpen: { type: Boolean, default: true },
  jerseyButtonTextMr: { type: String, default: 'जर्सी बुक करा' },
  jerseyButtonTextEn: { type: String, default: 'Book Jersey' },
  jerseyComingSoonVideoUrl: { type: String, default: '' },
  jerseyDisplayImages: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export const Settings = mongoose.model('Settings', SettingsSchema);
