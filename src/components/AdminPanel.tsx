import React, { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import { useLanguage } from '../context/LanguageContext';
import {
  CommitteeMember,
  DirectoryMember,
  GalleryItem,
  EventScheduleItem,
  SocialActivity,
  Sponsor,
  Announcement,
  JerseyBooking
} from '../types';
import { 
  Lock, Key, Shield, Plus, Trash2, Edit3, Save, RotateCcw, Download, Upload, 
  Megaphone, Users, UserCheck, Image as ImageIcon, Calendar, HeartHandshake, Award, Check, Shirt, Search, ArrowUpDown 
} from 'lucide-react';

interface AdminPanelProps {
  announcements: Announcement[];
  setAnnouncements: React.Dispatch<React.SetStateAction<Announcement[]>>;
  committee: CommitteeMember[];
  setCommittee: React.Dispatch<React.SetStateAction<CommitteeMember[]>>;
  members: DirectoryMember[];
  setMembers: React.Dispatch<React.SetStateAction<DirectoryMember[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  events: EventScheduleItem[];
  setEvents: React.Dispatch<React.SetStateAction<EventScheduleItem[]>>;
  activities: SocialActivity[];
  setActivities: React.Dispatch<React.SetStateAction<SocialActivity[]>>;
  sponsors: Sponsor[];
  setSponsors: React.Dispatch<React.SetStateAction<Sponsor[]>>;
  jerseyBookings: JerseyBooking[];
  setJerseyBookings: React.Dispatch<React.SetStateAction<JerseyBooking[]>>;
  settings: any;
  setSettings: (settings: any) => void;
  refetchData: () => void;
  resetAllData: () => void;
  adminPin: string | null;
  setAdminPin: (pin: string | null) => void;
  isBackendConnected?: boolean;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  announcements, setAnnouncements,
  committee, setCommittee,
  members, setMembers,
  gallery, setGallery,
  events, setEvents,
  activities, setActivities,
  sponsors, setSponsors,
  jerseyBookings, setJerseyBookings,
  settings,
  setSettings,
  refetchData,
  resetAllData,
  adminPin, setAdminPin,
  isBackendConnected
}) => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(!!adminPin);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'hero' | 'jersey-config' | 'announcements' | 'committee' | 'members' | 'gallery' | 'events' | 'sponsors' | 'jersey-bookings' | 'backup'>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // PIN verification via server API
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setPinError(false);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: pinInput })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem('admin_pin', pinInput);
        setAdminPin(pinInput);
        setIsAuthenticated(true);
      } else {
        setPinError(true);
      }
    } catch (err) {
      setPinError(true);
      console.error(err);
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Helper State for Modal or inline Add
  const [newAnnouncement, setNewAnnouncement] = useState({ textMr: '', textEn: '', isActive: true });
  const [newCommittee, setNewCommittee] = useState({ nameMr: '', nameEn: '', roleMr: '', roleEn: '', termYear: '2026-2027', photoUrl: '', phone: '' });
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null);
  
  const [newMember, setNewMember] = useState({ nameMr: '', nameEn: '', joinedYear: 2026, bloodGroup: '', phone: '', locationMr: '', locationEn: '', photoUrl: '', isLifetimeMember: false });
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const [newGallery, setNewGallery] = useState({ titleMr: '', titleEn: '', category: 'idol' as const, year: 2026, imageUrl: '', isHeroPinned: false });
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUploadType, setGalleryUploadType] = useState<'upload' | 'link'>('upload');
  const [newEvent, setNewEvent] = useState({ titleMr: '', titleEn: '', date: '2026-09-14', timeMr: 'सकाळी ८.०० वा.', timeEn: '8:00 AM', categoryMr: 'आरती', categoryEn: 'Aarti', locationMr: 'सातपाटी', locationEn: 'Satpati', isImportant: false });

  // Jersey Booking State
  const [newJerseyBooking, setNewJerseyBooking] = useState({ name: '', address: '', phone: '' });
  const [newJerseyItems, setNewJerseyItems] = useState<{ id: string, size: number, sleeveType: string, quantity: number }[]>([]);
  const [newJerseyCurrentItem, setNewJerseyCurrentItem] = useState({ size: 10, sleeveType: 'Half', quantity: 1 });
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingSizeFilter, setBookingSizeFilter] = useState<string>('all');
  const [bookingSort, setBookingSort] = useState<'asc' | 'desc'>('asc');

  // Global Settings State
  const [localSettings, setLocalSettings] = useState<any>(settings || {});
  useEffect(() => { setLocalSettings(settings || {}); }, [settings]);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${adminPin}` },
        body: JSON.stringify(localSettings)
      });
      if (res.ok) {
        const saved = await res.json();
        setSettings(saved);
        showToast('सेटिंग्ज जतन केल्या (Settings Saved)');
      }
    } catch (err) {
      console.error(err);
      showToast('त्रुटी (Error saving)');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleGenericFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    try {
      showToast('अपलोड करत आहे... (Uploading...)');
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${adminPin}` },
        body: formData
      });
      const data = await res.json();
      if (data.url) callback(data.url);
      showToast('फोटो अपलोड झाला! (Uploaded)');
    } catch (err) {
      console.error(err);
      showToast('अपलोड त्रुटी (Upload Error)');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    setIsUploadingGallery(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminPin}`
        },
        body: formData
      });
      const data = await res.json();
      if (data.url) setNewGallery({ ...newGallery, imageUrl: data.url });
    } catch (err) {
      console.error('Upload failed', err);
    } finally {
      setIsUploadingGallery(false);
    }
  };

  // Add Announcement
  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.textMr) return;
    const item: Announcement = {
      id: 'ann-' + Date.now(),
      textMr: newAnnouncement.textMr,
      textEn: newAnnouncement.textEn || newAnnouncement.textMr,
      isActive: newAnnouncement.isActive,
      date: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPin}`
        },
        body: JSON.stringify(item)
      });
      const saved = await res.json();
      setAnnouncements([saved, ...announcements]);
      setNewAnnouncement({ textMr: '', textEn: '', isActive: true });
      showToast('सूचना जोडली (Announcement Added)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPin}`
        }
      });
      setAnnouncements(announcements.filter(a => a.id !== id));
      showToast('सूचना डिलीट केली (Announcement Deleted)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  // Jersey Bookings Handlers
  const handleAddJerseyItem = () => {
    setNewJerseyItems([...newJerseyItems, { ...newJerseyCurrentItem, id: Date.now().toString() }]);
    setNewJerseyCurrentItem({ size: 10, sleeveType: 'Half', quantity: 1 });
  };

  const handleRemoveJerseyItem = (id: string) => {
    setNewJerseyItems(newJerseyItems.filter(item => item.id !== id));
  };

  const handleAddJerseyBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJerseyBooking.name.trim() || !newJerseyBooking.address.trim() || newJerseyItems.length === 0) {
      showToast('माहिती अपूर्ण आहे (Incomplete info)');
      return;
    }
    
    const item: JerseyBooking = {
      id: Date.now().toString(),
      name: newJerseyBooking.name.trim(),
      address: newJerseyBooking.address.trim(),
      phone: newJerseyBooking.phone.trim(),
      items: newJerseyItems,
      bookingDate: new Date().toISOString()
    };
    try {
      const res = await fetch(`${API_BASE_URL}/api/jersey-bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPin}`
        },
        body: JSON.stringify(item)
      });
      const saved = await res.json();
      setJerseyBookings([...jerseyBookings, saved]);
      setNewJerseyBooking({ name: '', address: '', phone: '' });
      setNewJerseyItems([]);
      showToast('जर्सी बुकिंग जोडली (Booking Added)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  const handleDeleteJerseyBooking = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/jersey-bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPin}`
        }
      });
      setJerseyBookings(jerseyBookings.filter(b => b.id !== id));
      showToast('बुकिंग डिलीट केली (Booking Deleted)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  const handleToggleJerseyBookingStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Pending' ? 'Verified' : 'Pending';
    try {
      const res = await fetch(`${API_BASE_URL}/api/jersey-bookings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminPin}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setJerseyBookings(jerseyBookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        showToast('स्थिती अद्ययावत केली (Status Updated)');
      }
    } catch (err) {
      showToast('त्रुटी (Error)'); console.error(err);
    }
  };

  // Add or Edit Committee Member
  const handleAddCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommittee.nameMr) return;

    if (editingCommitteeId) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/committee/${editingCommitteeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminPin}`
          },
          body: JSON.stringify(newCommittee)
        });
        const updated = await res.json();
        setCommittee(committee.map(c => c.id === editingCommitteeId ? updated : c));
        setEditingCommitteeId(null);
        setNewCommittee({ nameMr: '', nameEn: '', roleMr: '', roleEn: '', termYear: '2026-2027', photoUrl: '', phone: '' });
        showToast('कार्यकारिणी सदस्य अद्ययावत केले (Committee Member Updated)');
      } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
    } else {
      const item: CommitteeMember = {
        id: 'cm-' + Date.now(),
        nameMr: newCommittee.nameMr,
        nameEn: newCommittee.nameEn || newCommittee.nameMr,
        roleMr: newCommittee.roleMr || 'कार्यकारिणी सदस्य',
        roleEn: newCommittee.roleEn || 'Executive Member',
        termYear: newCommittee.termYear,
        photoUrl: newCommittee.photoUrl,
        phone: newCommittee.phone,
        order: committee.length + 1
      };
      try {
        const res = await fetch(`${API_BASE_URL}/api/committee`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminPin}`
          },
          body: JSON.stringify(item)
        });
        const saved = await res.json();
        setCommittee([...committee, saved]);
        setNewCommittee({ nameMr: '', nameEn: '', roleMr: '', roleEn: '', termYear: '2026-2027', photoUrl: '', phone: '' });
        showToast('नवीन कार्यकारिणी सदस्य जोडला (Committee Member Added)');
      } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
    }
  };

  const handleEditCommittee = (c: CommitteeMember) => {
    setEditingCommitteeId(c.id);
    setNewCommittee({
      nameMr: c.nameMr,
      nameEn: c.nameEn,
      roleMr: c.roleMr,
      roleEn: c.roleEn,
      termYear: c.termYear,
      photoUrl: c.photoUrl,
      phone: c.phone || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteCommittee = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/committee/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPin}`
        }
      });
      setCommittee(committee.filter(c => c.id !== id));
      showToast('कार्यकारिणी सदस्य डिलीट केला (Committee Member Deleted)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  // Add or Edit Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.nameMr) return;

    if (editingMemberId) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/members/${editingMemberId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminPin}`
          },
          body: JSON.stringify(newMember)
        });
        const updated = await res.json();
        setMembers(members.map(m => m.id === editingMemberId ? updated : m));
        setEditingMemberId(null);
        setNewMember({ nameMr: '', nameEn: '', joinedYear: 2026, bloodGroup: '', phone: '', locationMr: '', locationEn: '', photoUrl: '', isLifetimeMember: false });
        showToast('सभासद माहिती अद्ययावत केली (Member Updated)');
      } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
    } else {
      const item: DirectoryMember = {
        id: 'mem-' + Date.now(),
        nameMr: newMember.nameMr,
        nameEn: newMember.nameEn || newMember.nameMr,
        joinedYear: newMember.joinedYear,
        bloodGroup: newMember.bloodGroup,
        phone: newMember.phone,
        locationMr: newMember.locationMr,
        locationEn: newMember.locationEn,
        photoUrl: newMember.photoUrl,
        isLifetimeMember: newMember.isLifetimeMember
      };
      try {
        const res = await fetch(`${API_BASE_URL}/api/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminPin}`
          },
          body: JSON.stringify(item)
        });
        const saved = await res.json();
        setMembers([...members, saved]);
        setNewMember({ nameMr: '', nameEn: '', joinedYear: 2026, bloodGroup: '', phone: '', locationMr: '', locationEn: '', photoUrl: '', isLifetimeMember: false });
        showToast('नवीन सभासद जोडला (Member Added)');
      } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
    }
  };

  const handleEditMember = (m: DirectoryMember) => {
    setEditingMemberId(m.id);
    setNewMember({
      nameMr: m.nameMr,
      nameEn: m.nameEn,
      joinedYear: m.joinedYear,
      bloodGroup: m.bloodGroup || '',
      phone: m.phone || '',
      locationMr: m.locationMr || '',
      locationEn: m.locationEn || '',
      photoUrl: m.photoUrl || '',
      isLifetimeMember: m.isLifetimeMember || false
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteMember = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/members/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPin}`
        }
      });
      setMembers(members.filter(m => m.id !== id));
      showToast('सभासद डिलीट केला (Member Deleted)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  // Add or Edit Gallery Item
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.titleMr || !newGallery.imageUrl) return;
    
    if (editingGalleryId) {
      try {
        const res = await fetch(`${API_BASE_URL}/api/gallery/${editingGalleryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminPin}`
          },
          body: JSON.stringify(newGallery)
        });
        const updated = await res.json();
        setGallery(gallery.map(g => g.id === editingGalleryId ? updated : g));
        setEditingGalleryId(null);
        setNewGallery({ titleMr: '', titleEn: '', category: 'idol', year: 2026, imageUrl: '', isHeroPinned: false });
        setGalleryUploadType('upload');
        showToast('गॅलरी माहिती अद्ययावत झाली (Gallery Updated)');
      } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
    } else {
      const item: GalleryItem = {
        id: 'gal-' + Date.now(),
        titleMr: newGallery.titleMr,
        titleEn: newGallery.titleEn || newGallery.titleMr,
        category: newGallery.category,
        year: newGallery.year,
        imageUrl: newGallery.imageUrl,
        isHeroPinned: newGallery.isHeroPinned
      };
      try {
        const res = await fetch(`${API_BASE_URL}/api/gallery`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminPin}`
          },
          body: JSON.stringify(item)
        });
        const saved = await res.json();
        setGallery([saved, ...gallery]);
        setNewGallery({ titleMr: '', titleEn: '', category: 'idol', year: 2026, imageUrl: '', isHeroPinned: false });
        setGalleryUploadType('upload');
        showToast('नवीन फोटो जोडला (Photo Added)');
      } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
    }
  };

  const handleEditGallery = (g: GalleryItem) => {
    setEditingGalleryId(g.id);
    setNewGallery({
      titleMr: g.titleMr,
      titleEn: g.titleEn,
      category: g.category as any,
      year: g.year || 2026,
      imageUrl: g.imageUrl,
      isHeroPinned: g.isHeroPinned || false
    });
    setGalleryUploadType(g.imageUrl.includes('instagram.com') ? 'link' : 'upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPin}`
        }
      });
      setGallery(gallery.filter(g => g.id !== id));
      showToast('फोटो डिलीट केला (Photo Deleted)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await fetch(`${API_BASE_URL}/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminPin}`
        }
      });
      setEvents(events.filter(e => e.id !== id));
      showToast('कार्यक्रम डिलीट केला (Event Deleted)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      announcements,
      committee,
      members,
      gallery,
      events,
      activities,
      sponsors,
      exportedAt: new Date().toISOString()
    };
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(backupData, null, 2))}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `taqdeer_satpati_backup_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 font-marathi">
        <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-xl space-y-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF8F5] border border-[#C89B3C]/30 text-[#FF9933] flex items-center justify-center mx-auto shadow-2xs">
            <Lock className="w-6 h-6" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-extrabold text-gray-900">
              {t('प्रशासकीय कक्ष (Admin Login)', 'Admin Portal Login')}
            </h2>
            <p className="text-xs text-gray-500">
              {t('तकदीर मित्र मंडळाच्या अधिकृत व्यवस्थापनासाठी पिन प्रविष्ट करा.', 'Enter security PIN to manage Mandal data.')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder={t('सुरक्षा पिन प्रविष्ट करा', 'Enter Security PIN')}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 text-center font-mono text-lg focus:outline-none focus:border-[#FF9933] shadow-2xs"
                autoFocus
              />
              {pinError && (
                <p className="text-xs text-red-500 font-semibold mt-1.5">
                  {t('चुकीचा पिन! प्रवेश नाकारला.', 'Invalid PIN! Access Denied.')}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-sm shadow-md transition-colors"
            >
              {t('प्रवेश करा (Login)', 'Login to Portal')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8 font-marathi">
      
      {/* Admin Top Header Bar */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#FF9933] text-white flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold">
              {t('प्रशासकीय व्यवस्थापन कक्ष', 'Mandal Management Portal')}
            </h2>
            <p className="text-xs text-gray-300">
              {t('तकदीर मित्र मंडळ, सातपाटी - सर्व माहिती अद्ययावत करा', 'Taqdeer Mitra Mandal Satpati Live Admin Control')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportBackup}
            className="px-3.5 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold border border-gray-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>{t('बैकअप डाऊनलोड (JSON)', 'Export Backup')}</span>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('admin_pin');
              setAdminPin(null);
              setIsAuthenticated(false);
            }}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
          >
            {t('बाहेर पडा (Logout)', 'Logout')}
          </button>

          <div className="mt-6 flex items-center justify-center gap-2 text-xs font-medium bg-white/50 py-2 rounded-lg border border-gray-100">
            <span className="relative flex h-2.5 w-2.5">
              {isBackendConnected ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              )}
            </span>
            <span className={isBackendConnected ? "text-emerald-700" : "text-red-600"}>
              {isBackendConnected ? 'Backend Connected' : 'Backend Disconnected'}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Admin Sidebar Navigation */}
        <div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">
          
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 px-2">{t('मुख्य व्यवस्थापन', 'Main Config')}</h3>
          
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'hero' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#FF9933]/50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t('हिरो सेक्शन (Hero Area)', 'Hero Settings')}</span>
          </button>

          <button
            onClick={() => setActiveTab('jersey-config')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'jersey-config' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#FF9933]/50'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>{t('जर्सी नियंत्रण (Jersey Config)', 'Jersey Config')}</span>
          </button>

          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 mt-4 px-2">{t('डेटा व्यवस्थापन', 'Data Management')}</h3>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'announcements' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>{t('सूचना फलक (Banner)', 'Announcements')}</span>
          </button>

          <button
            onClick={() => setActiveTab('committee')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'committee' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{t('कार्यकारिणी (Committee)', 'Committee')}</span>
          </button>

          <button
            onClick={() => setActiveTab('members')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'members' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>{t('सभासद (Members)', 'Members')}</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'gallery' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>{t('गॅलरी (Gallery)', 'Gallery')}</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'events' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('कार्यक्रम (Events)', 'Events')}</span>
          </button>

          <button
            onClick={() => setActiveTab('jersey-bookings')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'jersey-bookings' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>{t('जर्सी बुकिंग लिस्ट', 'Bookings List')}</span>
          </button>

          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-3 transition-all ${
              activeTab === 'backup' ? 'bg-[#FF9933] text-white shadow-md' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t('रिसेट / रीस्टोर', 'Reset Data')}</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 min-w-0">

          {/* TAB CONTENT: DASHBOARD (Default) */}
          {activeTab === 'dashboard' && (
            <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
              <Shield className="w-16 h-16 text-[#FF9933] mb-4 opacity-80" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('स्वागत आहे, ॲडमिन!', 'Welcome, Admin!')}
              </h2>
              <p className="text-gray-500 max-w-md">
                {t('डावीकडील मेनूमधून तुम्ही मंडळाची संपूर्ण वेबसाइट नियंत्रित करू शकता. फोटो अपलोड, जर्सी बुकिंग आणि सूचना व्यवस्थापित करा.', 'Use the sidebar menu to completely control the Mandal website. Upload photos, manage Jersey bookings, and announcements.')}
              </p>
            </div>
          )}

          {/* TAB CONTENT: HERO SETTINGS */}
          {activeTab === 'hero' && (
            <form onSubmit={handleSaveSettings} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900">{t('हिरो सेक्शन नियंत्रण (Hero Settings)', 'Hero Settings')}</h3>
                <button type="submit" disabled={isSavingSettings} className="px-6 py-2 bg-[#FF9933] text-white font-bold rounded-xl shadow-md hover:bg-[#E68A2E]">
                  {isSavingSettings ? 'Saving...' : t('जतन करा (Save)', 'Save Settings')}
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl border">
                <div>
                  <h4 className="font-bold text-lg">{t('गॅलरी स्लाइडशो (Gallery Slideshow)', 'Gallery Slideshow')}</h4>
                  <p className="text-gray-500 text-sm">{t('गॅलरीमधील पिन केलेले फोटो स्लाइडशो म्हणून दाखवायचे का ते ठरवा.', 'Toggle whether to show pinned gallery images as a slideshow.')}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setLocalSettings({...localSettings, isHeroSlideshowEnabled: !localSettings.isHeroSlideshowEnabled})}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${localSettings.isHeroSlideshowEnabled ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${localSettings.isHeroSlideshowEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              {!localSettings.isHeroSlideshowEnabled && (
                <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Image Title (मराठी)</label>
                    <input type="text" value={localSettings.heroTitleMr || ''} onChange={e => setLocalSettings({...localSettings, heroTitleMr: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="e.g. मुख्य आकर्षण" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Image Title (English)</label>
                    <input type="text" value={localSettings.heroTitleEn || ''} onChange={e => setLocalSettings({...localSettings, heroTitleEn: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="e.g. Center of Attraction" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Image Caption (मराठी)</label>
                    <input type="text" value={localSettings.heroSubtitleMr || ''} onChange={e => setLocalSettings({...localSettings, heroSubtitleMr: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="e.g. २०२६ गणेशोत्सव" />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Image Caption (English)</label>
                    <input type="text" value={localSettings.heroSubtitleEn || ''} onChange={e => setLocalSettings({...localSettings, heroSubtitleEn: e.target.value})} className="w-full p-3 border rounded-xl" placeholder="e.g. 2026 Festival" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block font-bold text-gray-700 mb-2">Background Image/Video Upload</label>
                <div className="flex items-center gap-4">
                  <input type="file" accept="image/*,video/*" onChange={e => handleGenericFileUpload(e, url => setLocalSettings({...localSettings, heroVideoUrl: url, heroImageUrl: url}))} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                </div>
                {localSettings.heroImageUrl && (
                  localSettings.heroImageUrl.match(/\.(mp4|webm|ogg|mov)$/i) || localSettings.heroImageUrl.includes('/video/upload/') ? (
                    <video src={localSettings.heroImageUrl} className="mt-4 w-64 rounded-xl shadow-md border" autoPlay muted loop controls />
                  ) : (
                    <img src={localSettings.heroImageUrl} alt="Hero Preview" className="mt-4 w-48 rounded-xl shadow-md border" />
                  )
                )}
              </div>
                </>
              )}
            </form>
          )}

          {/* TAB CONTENT: JERSEY CONFIG */}
          {activeTab === 'jersey-config' && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b pb-4 mb-4">
                <h3 className="text-xl font-bold text-gray-900">{t('जर्सी बुकिंग नियंत्रण (Jersey Config)', 'Jersey Config')}</h3>
                <button onClick={() => handleSaveSettings()} disabled={isSavingSettings} className="px-6 py-2 bg-[#FF9933] text-white font-bold rounded-xl shadow-md hover:bg-[#E68A2E]">
                  {isSavingSettings ? 'Saving...' : t('जतन करा (Save)', 'Save Settings')}
                </button>
              </div>

              <div className="flex items-center justify-between bg-gray-50 p-6 rounded-2xl border">
                <div>
                  <h4 className="font-bold text-lg">{t('बुकिंग स्थिती', 'Booking Status')}</h4>
                  <p className="text-gray-500 text-sm">{t('जर्सी बुकिंग चालू आहे की बंद हे येथून ठरवा.', 'Toggle whether the Jersey booking form is open.')}</p>
                </div>
                <button 
                  onClick={() => setLocalSettings({...localSettings, isJerseyRegistrationOpen: !localSettings.isJerseyRegistrationOpen})}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${localSettings.isJerseyRegistrationOpen ? 'bg-green-500' : 'bg-red-500'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${localSettings.isJerseyRegistrationOpen ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text (मराठी)</label>
                  <input type="text" value={localSettings.jerseyButtonTextMr || ''} onChange={e => setLocalSettings({...localSettings, jerseyButtonTextMr: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text (English)</label>
                  <input type="text" value={localSettings.jerseyButtonTextEn || ''} onChange={e => setLocalSettings({...localSettings, jerseyButtonTextEn: e.target.value})} className="w-full p-3 border rounded-xl" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <label className="block font-bold text-gray-700 mb-2">Coming Soon Video (If Booking is Closed)</label>
                <input type="file" accept="video/*" onChange={e => handleGenericFileUpload(e, url => setLocalSettings({...localSettings, jerseyComingSoonVideoUrl: url}))} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
                {localSettings.jerseyComingSoonVideoUrl && (
                  <video src={localSettings.jerseyComingSoonVideoUrl} className="mt-4 w-64 rounded-xl shadow-md border" controls />
                )}
              </div>
            </div>
          )}

      {/* TAB CONTENT 1: ANNOUNCEMENTS */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          
          {/* Add Form */}
          <form onSubmit={handleAddAnnouncement} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FF9933]" />
              <span>{t('नवी सूचना जोडा', 'Add New Announcement')}</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">मराठी सूचना</label>
                <input
                  type="text"
                  required
                  value={newAnnouncement.textMr}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, textMr: e.target.value})}
                  placeholder="उदा. श्री गणेशोत्सव २०२६ महाआरती वेळ..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">English Announcement</label>
                <input
                  type="text"
                  value={newAnnouncement.textEn}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, textEn: e.target.value})}
                  placeholder="e.g. Shree Ganeshotsav 2026 Daily Aarti Schedule..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm bg-white"
                />
              </div>
            </div>

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs shadow-xs">
              {t('सूचना प्रकाशित करा', 'Publish Announcement')}
            </button>
          </form>

          {/* List */}
          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl bg-white border border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-gray-900">{ann.textMr}</div>
                  <div className="text-xs text-gray-500">{ann.textEn}</div>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB CONTENT 2: COMMITTEE */}
      {activeTab === 'committee' && (
        <div className="space-y-6">
          <form onSubmit={handleAddCommittee} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              {editingCommitteeId ? <Edit3 className="w-4 h-4 text-[#FF9933]" /> : <Plus className="w-4 h-4 text-[#FF9933]" />}
              <span>{editingCommitteeId ? t('सदस्य माहिती अद्ययावत करा', 'Update Committee Member') : t('नवीन कार्यकारिणी सदस्य जोडा', 'Add Committee Member')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">नाव (मराठी)</label>
                <input
                  type="text"
                  required
                  value={newCommittee.nameMr}
                  onChange={(e) => setNewCommittee({...newCommittee, nameMr: e.target.value})}
                  placeholder="उदा. श्री. विजय मेहेर"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">पद (मराठी)</label>
                <input
                  type="text"
                  value={newCommittee.roleMr}
                  onChange={(e) => setNewCommittee({...newCommittee, roleMr: e.target.value})}
                  placeholder="उदा. अध्यक्ष / सहसचिव"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">कालावधी (Term)</label>
                <input
                  type="text"
                  value={newCommittee.termYear}
                  onChange={(e) => setNewCommittee({...newCommittee, termYear: e.target.value})}
                  placeholder="2026-2027"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">फोटो लिंक (Photo URL)</label>
                <input
                  type="url"
                  value={newCommittee.photoUrl}
                  onChange={(e) => setNewCommittee({...newCommittee, photoUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">फोन नंबर</label>
                <input
                  type="tel"
                  value={newCommittee.phone}
                  onChange={(e) => setNewCommittee({...newCommittee, phone: e.target.value})}
                  placeholder="+91 98230 XXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs shadow-xs">
                {editingCommitteeId ? t('माहिती अद्ययावत करा', 'Update Member') : t('सदस्य जोडा', 'Add Member')}
              </button>
              {editingCommitteeId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingCommitteeId(null);
                    setNewCommittee({ nameMr: '', nameEn: '', roleMr: '', roleEn: '', termYear: '2026-2027', photoUrl: '', phone: '' });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs shadow-xs"
                >
                  {t('रद्द करा', 'Cancel')}
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {committee.map((c) => (
              <div key={c.id} className="p-4 rounded-xl bg-white border border-gray-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                    {c.photoUrl ? (
                      <img src={c.photoUrl} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <UserCheck className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900">{c.nameMr}</div>
                    <div className="text-xs text-[#FF9933]">{c.roleMr} ({c.termYear})</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditCommittee(c)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteCommittee(c.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 2.5: MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <form onSubmit={handleAddMember} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              {editingMemberId ? <Edit3 className="w-4 h-4 text-[#FF9933]" /> : <Plus className="w-4 h-4 text-[#FF9933]" />}
              <span>{editingMemberId ? t('सभासद माहिती अद्ययावत करा', 'Update Member') : t('नवीन सभासद जोडा', 'Add Member')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">नाव (मराठी)</label>
                <input
                  type="text"
                  required
                  value={newMember.nameMr}
                  onChange={(e) => setNewMember({...newMember, nameMr: e.target.value})}
                  placeholder="उदा. श्री. विकास म्हात्रे"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">प्रवेश वर्ष (Joined Year)</label>
                <input
                  type="number"
                  required
                  value={newMember.joinedYear}
                  onChange={(e) => setNewMember({...newMember, joinedYear: parseInt(e.target.value) || 2026})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">फोन नंबर</label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
                  placeholder="+91 98230 XXXXX"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">रक्तगट (Blood Group)</label>
                <input
                  type="text"
                  value={newMember.bloodGroup}
                  onChange={(e) => setNewMember({...newMember, bloodGroup: e.target.value})}
                  placeholder="उदा. O+"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">पत्ता (Location - Marathi)</label>
                <input
                  type="text"
                  value={newMember.locationMr}
                  onChange={(e) => setNewMember({...newMember, locationMr: e.target.value})}
                  placeholder="उदा. सातपाटी बंदर"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">फोटो लिंक (Photo URL)</label>
                <input
                  type="url"
                  value={newMember.photoUrl}
                  onChange={(e) => setNewMember({...newMember, photoUrl: e.target.value})}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div className="flex items-center gap-2 col-span-1 md:col-span-3 pt-2">
                <input
                  type="checkbox"
                  id="lifetime"
                  checked={newMember.isLifetimeMember}
                  onChange={(e) => setNewMember({...newMember, isLifetimeMember: e.target.checked})}
                  className="w-4 h-4 text-[#FF9933] border-gray-300 rounded focus:ring-[#FF9933]"
                />
                <label htmlFor="lifetime" className="font-semibold text-gray-700">
                  {t('आजीवन सभासद (Lifetime Member)', 'Lifetime Member')}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs shadow-xs">
                {editingMemberId ? t('माहिती अद्ययावत करा', 'Update Member') : t('सभासद जोडा', 'Add Member')}
              </button>
              {editingMemberId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingMemberId(null);
                    setNewMember({ nameMr: '', nameEn: '', joinedYear: 2026, bloodGroup: '', phone: '', locationMr: '', locationEn: '', photoUrl: '', isLifetimeMember: false });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs shadow-xs"
                >
                  {t('रद्द करा', 'Cancel')}
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {members.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-white border border-gray-200 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                    {m.photoUrl ? (
                      <img src={m.photoUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <UserCheck className="w-full h-full p-2 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                      {m.nameMr}
                      {m.isLifetimeMember && <Award className="w-3.5 h-3.5 text-[#FF9933]" />}
                    </div>
                    <div className="text-[10px] text-gray-500">{t('प्रवेश: ', 'Joined: ')} {m.joinedYear}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEditMember(m)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMember(m.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: GALLERY */}
      {activeTab === 'gallery' && (
        <div className="space-y-6">
          <form onSubmit={handleAddGallery} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FF9933]" />
              <span>{t('गॅलरीमध्ये फोटो जोडा', 'Add Photo to Gallery')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">शीर्षक (मराठी)</label>
                <input
                  type="text"
                  required
                  value={newGallery.titleMr}
                  onChange={(e) => setNewGallery({...newGallery, titleMr: e.target.value})}
                  placeholder="उदा. श्रींची प्रसन्न मूर्ती"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div className="col-span-1 sm:col-span-2 md:col-span-3 flex items-start sm:items-center gap-4">
                <div className="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center border border-gray-300 overflow-hidden shrink-0 shadow-sm relative">
                  {newGallery.imageUrl ? (
                    newGallery.category === 'instagram' || newGallery.imageUrl.includes('instagram.com') ? (
                      <ImageIcon className="w-8 h-8 text-[#FF9933]" />
                    ) : (
                      <img src={newGallery.imageUrl} alt="preview" className="w-full h-full object-cover" />
                    )
                  ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-[9px] font-bold">Placeholder</span>
                    </div>
                  )}
                  {isUploadingGallery && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-[#FF9933] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-lg w-max">
                    <button
                      type="button"
                      onClick={() => { setGalleryUploadType('upload'); setNewGallery({...newGallery, imageUrl: ''}); }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${galleryUploadType === 'upload' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {t('अपलोड (Upload)', 'Upload File')}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setGalleryUploadType('link'); setNewGallery({...newGallery, imageUrl: ''}); }}
                      className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${galleryUploadType === 'link' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                      {t('लिंक (Link)', 'Web Link')}
                    </button>
                  </div>

                  {galleryUploadType === 'upload' ? (
                    <div>
                      <label className="block font-semibold mb-1">फोटो अपलोड करा (Upload File)*</label>
                      <input
                        type="file"
                        required={!newGallery.imageUrl}
                        accept="image/*"
                        onChange={handleFileUpload}
                        disabled={isUploadingGallery}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FF9933] file:text-white hover:file:bg-[#e68a2e] bg-white border border-gray-300 rounded-xl cursor-pointer"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-semibold mb-1">फोटो लिंक / इंस्टाग्राम रील लिंक (URL)*</label>
                      <input
                        type="url"
                        required
                        value={newGallery.imageUrl}
                        onChange={(e) => setNewGallery({...newGallery, imageUrl: e.target.value})}
                        placeholder="उदा. https://www.instagram.com/reel/..."
                        className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-1 md:col-span-2">
                <div>
                  <label className="block font-semibold mb-1">वर्गवारी (Category)</label>
                  <select
                    value={newGallery.category}
                    onChange={(e) => setNewGallery({...newGallery, category: e.target.value as any})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="idol">श्रींची मूर्ती (Ganesh Idol)</option>
                    <option value="decoration">देखावा (Decoration)</option>
                    <option value="aarti">महाआरती (Aarti)</option>
                    <option value="cultural">सांस्कृतिक (Cultural)</option>
                    <option value="social">सामाजिक (Social)</option>
                    <option value="visarjan">विसर्जन (Visarjan)</option>
                    <option value="memories">जुन्या आठवणी (Old Memories)</option>
                    <option value="instagram">इन्स्टाग्राम (Instagram)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">वर्ष (Year)</label>
                  <input
                    type="number"
                    required
                    value={newGallery.year}
                    onChange={(e) => setNewGallery({...newGallery, year: parseInt(e.target.value) || new Date().getFullYear()})}
                    placeholder="उदा. 2024"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                    min="1980"
                    max="2100"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 col-span-1 md:col-span-2 pt-2">
                <input
                  type="checkbox"
                  id="heroPinned"
                  checked={newGallery.isHeroPinned}
                  onChange={(e) => setNewGallery({...newGallery, isHeroPinned: e.target.checked})}
                  className="w-4 h-4 text-[#FF9933] border-gray-300 rounded focus:ring-[#FF9933]"
                />
                <label htmlFor="heroPinned" className="font-semibold text-gray-700">
                  {t('हिरो सेक्शनला जोडा (Pin to Hero Slideshow)', 'Pin to Hero Slideshow')}
                </label>
              </div>
            </div>

            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs shadow-xs">
                {editingGalleryId ? t('गॅलरी अद्ययावत करा', 'Update Gallery') : t('फोटो प्रकाशित करा', 'Publish Photo')}
              </button>
              {editingGalleryId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingGalleryId(null);
                    setNewGallery({ titleMr: '', titleEn: '', category: 'idol', year: 2026, imageUrl: '', isHeroPinned: false });
                  }}
                  className="px-5 py-2.5 rounded-xl bg-gray-200 text-gray-700 font-bold text-xs shadow-xs"
                >
                  {t('रद्द करा', 'Cancel')}
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {gallery.map((g) => (
              <div key={g.id} className="relative rounded-xl overflow-hidden border border-gray-200 bg-white group">
                <img src={g.imageUrl} alt="" className="w-full h-32 object-cover" />
                <div className="p-2 text-xs font-bold truncate">{g.titleMr}</div>
                <div className="absolute top-2 right-2 flex items-center gap-1.5">
                  <button
                    onClick={() => handleEditGallery(g)}
                    className="p-1.5 rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition-colors"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteGallery(g.id)}
                    className="p-1.5 rounded-full bg-red-600 text-white shadow-md hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: HISTORY MILESTONES */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <form onSubmit={handleAddMilestone} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FF9933]" />
              <span>{t('नवीन इतिहास जोडा', 'Add History Milestone')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">वर्ष (Year)</label>
                <input
                  type="text"
                  required
                  value={newMilestone.year}
                  onChange={(e) => setNewMilestone({...newMilestone, year: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  placeholder="e.g. १९८१"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">शीर्षक (मराठी)</label>
                <input
                  type="text"
                  required
                  value={newMilestone.titleMr}
                  onChange={(e) => setNewMilestone({...newMilestone, titleMr: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  placeholder="e.g. मंडळाची स्थापना"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">शीर्षक (English)</label>
                <input
                  type="text"
                  value={newMilestone.titleEn}
                  onChange={(e) => setNewMilestone({...newMilestone, titleEn: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">माहिती (मराठी)</label>
                <textarea
                  value={newMilestone.descriptionMr}
                  onChange={(e) => setNewMilestone({...newMilestone, descriptionMr: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  rows={2}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">माहिती (English)</label>
                <textarea
                  value={newMilestone.descriptionEn}
                  onChange={(e) => setNewMilestone({...newMilestone, descriptionEn: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  rows={2}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">फोटो अपलोड (Optional)</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      if (!e.target.files || !e.target.files.length) return;
                      setIsUploadingMilestone(true);
                      const formData = new FormData();
                      formData.append('image', e.target.files[0]);
                      try {
                        const res = await fetch(`${API_BASE_URL}/api/upload`, {
                          method: 'POST',
                          headers: { 'Authorization': `Bearer ${adminPin}` },
                          body: formData
                        });
                        const data = await res.json();
                        if (data.url) setNewMilestone({...newMilestone, imageUrl: data.url});
                      } catch (err) {}
                      setIsUploadingMilestone(false);
                    }}
                    disabled={isUploadingMilestone}
                    className="flex-1 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#FF9933] file:text-white bg-white border border-gray-300 rounded-xl cursor-pointer"
                  />
                  {isUploadingMilestone && <span className="text-[#FF9933] font-bold text-xs">Uploading...</span>}
                  {newMilestone.imageUrl && <img src={newMilestone.imageUrl} alt="Preview" className="w-12 h-12 rounded object-cover" />}
                </div>
              </div>
            </div>

            <button type="submit" disabled={isUploadingMilestone} className="mt-4 px-6 py-2.5 bg-[#FF9933] text-white font-bold rounded-xl shadow-md text-sm hover:bg-[#E68A2E]">
              {t('जोडा (Add)', 'Add')}
            </button>
          </form>

          <div className="space-y-4">
            {milestones.map((m) => (
              <div key={m.id} className="p-4 rounded-xl bg-white border border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {m.imageUrl && <img src={m.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                  <div>
                    <div className="text-sm font-bold text-gray-900">{m.year} - {m.titleMr}</div>
                    <div className="text-xs text-gray-500 line-clamp-2">{m.descriptionMr}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMilestone(m.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 5: EVENTS */}
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="text-sm font-bold text-gray-700">
            {t(`एकूण कार्यक्रम: ${events.length}`, `Total Events: ${events.length}`)}
          </div>
          <div className="space-y-2">
            {events.map((e) => (
              <div key={e.id} className="p-4 rounded-xl bg-white border border-gray-200 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-gray-900">{e.titleMr}</div>
                  <div className="text-xs text-gray-500">{e.date} • {e.timeMr} • {e.locationMr}</div>
                </div>
                <button
                  onClick={() => handleDeleteEvent(e.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 6: JERSEY BOOKINGS */}
      {activeTab === 'jersey-bookings' && (
        <div className="space-y-6">
          <form onSubmit={handleAddJerseyBooking} className="bg-[#FAF8F5] p-6 rounded-2xl border border-gray-200 space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FF9933]" />
              <span>{t('नवीन जर्सी बुकिंग जोडा', 'Add Jersey Booking')}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">नाव (Name)</label>
                <input
                  type="text"
                  required
                  value={newJerseyBooking.name}
                  onChange={(e) => setNewJerseyBooking({...newJerseyBooking, name: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">पत्ता (Address)</label>
                <input
                  type="text"
                  required
                  value={newJerseyBooking.address}
                  onChange={(e) => setNewJerseyBooking({...newJerseyBooking, address: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold mb-1">फोन (Phone)</label>
                <input
                  type="text"
                  required
                  value={newJerseyBooking.phone}
                  onChange={(e) => setNewJerseyBooking({...newJerseyBooking, phone: e.target.value})}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-4">
              <div className="font-bold text-gray-700 text-sm mb-2 border-b pb-2">जर्सी तपशील जोडा (Add Jersey Details)</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">प्रमाण (Quantity)</label>
                  <input
                    type="number"
                    min="1"
                    value={newJerseyCurrentItem.quantity}
                    onChange={(e) => setNewJerseyCurrentItem({...newJerseyCurrentItem, quantity: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">साईझ (Size)</label>
                  <select
                    value={newJerseyCurrentItem.size}
                    onChange={(e) => setNewJerseyCurrentItem({...newJerseyCurrentItem, size: Number(e.target.value)})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  >
                    {Array.from({ length: 21 }, (_, i) => 10 + i * 2).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">स्लीव्ह (Sleeve)</label>
                  <select
                    value={newJerseyCurrentItem.sleeveType}
                    onChange={(e) => setNewJerseyCurrentItem({...newJerseyCurrentItem, sleeveType: e.target.value})}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 bg-white"
                  >
                    <option value="Half">हाफ (Half)</option>
                    <option value="Full">फुल (Full)</option>
                  </select>
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddJerseyItem}
                className="w-full py-2 rounded-lg border-2 border-dashed border-[#FF9933] text-[#FF9933] font-bold text-xs hover:bg-[#FF9933]/10 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-3 h-3" /> जर्सी जोडा (Add Jersey)
              </button>
            </div>

            {newJerseyItems.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-gray-700 border-b pb-1">तुमची ऑर्डर (Order Details) - {newJerseyItems.reduce((s, i) => s + i.quantity, 0)} Jerseys</div>
                {newJerseyItems.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200">
                    <div className="text-xs">
                      <span className="font-bold text-gray-800">{idx + 1}.</span> <span className="text-[#FF9933] font-bold ml-1">Size {item.size}</span> | {item.sleeveType} | <span className="font-semibold text-gray-700">Qty {item.quantity}</span>
                    </div>
                    <button type="button" onClick={() => handleRemoveJerseyItem(item.id)} className="text-red-500 hover:bg-red-50 p-1 rounded">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button type="submit" className="px-5 py-2.5 rounded-xl bg-gray-900 text-white font-bold text-xs shadow-xs">
              {t('बुकिंग सेव्ह करा', 'Save Booking')}
            </button>
          </form>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('नावाने शोधा...', 'Search by name...')}
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 focus:bg-white transition-all"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <select
                  value={bookingSizeFilter}
                  onChange={(e) => setBookingSizeFilter(e.target.value)}
                  className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#FF9933]/50 transition-colors cursor-pointer"
                >
                  <option value="all">{t('सर्व साईझ', 'All Sizes')}</option>
                  {Array.from({ length: 21 }, (_, i) => 10 + i * 2).map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <button
                  onClick={() => setBookingSort(prev => prev === 'asc' ? 'desc' : 'asc')}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span>{t('साईझ', 'Size')} ({bookingSort === 'asc' ? '↑' : '↓'})</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/50">
                    <th className="p-4 text-sm font-bold text-gray-700">{t('नाव', 'Name')}</th>
                    <th className="p-4 text-sm font-bold text-gray-700">{t('पत्ता', 'Address')}</th>
                    <th className="p-4 text-sm font-bold text-gray-700">{t('फोन', 'Phone')}</th>
                    <th className="p-4 text-sm font-bold text-gray-700">{t('प्रमाण', 'Qty')}</th>
                    <th className="p-4 text-sm font-bold text-gray-700">{t('साईझ', 'Size')}</th>
                    <th className="p-4 text-sm font-bold text-gray-700">{t('स्लीव्ह', 'Sleeve')}</th>
                    <th className="p-4 text-sm font-bold text-gray-700 text-center">{t('स्थिती', 'Status')}</th>
                    <th className="p-4 text-sm font-bold text-gray-700 text-right">{t('क्रिया', 'Action')}</th>
                  </tr>
                </thead>
                <tbody>
                  {jerseyBookings
                    .flatMap(b => (b.items || []).map(i => ({ ...i, bookingId: b.id, name: b.name, address: b.address, phone: b.phone, status: b.status || 'Pending' })))
                    .filter(b => b.name.toLowerCase().includes(bookingSearch.toLowerCase()))
                    .filter(b => bookingSizeFilter === 'all' || b.size === Number(bookingSizeFilter))
                    .sort((a, b) => bookingSort === 'asc' ? a.size - b.size : b.size - a.size)
                    .map((booking) => (
                    <tr key={`${booking.bookingId}-${booking.id}`} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                      <td className="p-4 text-sm font-medium text-gray-900">{booking.name}</td>
                      <td className="p-4 text-sm text-gray-600 max-w-[150px] truncate" title={booking.address}>{booking.address}</td>
                      <td className="p-4 text-sm text-gray-800 font-bold">{booking.phone}</td>
                      <td className="p-4 text-sm text-gray-900 text-center font-bold">{booking.quantity}</td>
                      <td className="p-4 text-sm font-bold text-[#FF9933]">{booking.size}</td>
                      <td className="p-4 text-sm text-gray-600">{booking.sleeveType === 'Half' ? t('हाफ', 'Half') : t('फुल', 'Full')}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleJerseyBookingStatus(booking.bookingId, booking.status)}
                          className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm transition-colors cursor-pointer ${
                            booking.status === 'Verified' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                          }`}
                        >
                          {booking.status === 'Verified' ? 'Verified ✓' : 'Pending'}
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteJerseyBooking(booking.bookingId)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Entire Booking"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {jerseyBookings.length === 0 && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">
                        {t('कोणतेही बुकिंग आढळले नाही.', 'No bookings found.')}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-xs font-bold text-gray-400 flex justify-end gap-4">
              <span>{t('एकूण ऑर्डर्स:', 'Total Orders:')} <span className="text-gray-700">{jerseyBookings.length}</span></span>
              <span>{t('एकूण जर्सी:', 'Total Jerseys:')} <span className="text-gray-700">{jerseyBookings.reduce((sum, b) => sum + (b.items?.reduce((s, i) => s + i.quantity, 0) || 0), 0)}</span></span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 7: RESET DATA */}
      {activeTab === 'backup' && (
        <div className="p-8 rounded-2xl bg-red-50 border border-red-200 text-center space-y-4">
          <RotateCcw className="w-10 h-10 text-red-600 mx-auto" />
          <h3 className="text-lg font-bold text-red-900">
            {t('माहिती रीसेट करा (Reset Factory Data)', 'Reset All Data to Original Defaults')}
          </h3>
          <p className="text-xs text-red-700 max-w-md mx-auto">
            {t('यामुळे आपण केलेले बदल पुसले जातील व मूळ सातपाटी डेटा पुनर्स्थापित होईल.', 'This will overwrite your local changes and reload initial Satpati Mandal data.')}
          </p>
          <button
            onClick={resetAllData}
            className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md"
          >
            {t('होय, डेटा रीसेट करा (Reset Now)', 'Reset All Data Now')}
          </button>
        </div>
      )}

    </div>
    </div>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300 z-50 border border-gray-700">
          <Check className="w-5 h-5 text-green-400" />
          <span className="text-sm font-bold font-marathi">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
