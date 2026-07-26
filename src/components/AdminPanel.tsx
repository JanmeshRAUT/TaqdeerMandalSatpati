import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import {
  CommitteeMember,
  DirectoryMember,
  GalleryItem,
  EventScheduleItem,
  SocialActivity,
  Sponsor,
  Announcement
} from '../types';
import { 
  Lock, Key, Shield, Plus, Trash2, Edit3, Save, RotateCcw, Download, Upload, 
  Megaphone, Users, UserCheck, Image as ImageIcon, Calendar, HeartHandshake, Award, Check 
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
  resetAllData: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  announcements, setAnnouncements,
  committee, setCommittee,
  members, setMembers,
  gallery, setGallery,
  events, setEvents,
  activities, setActivities,
  sponsors, setSponsors,
  resetAllData
}) => {
  const { t } = useLanguage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'announcements' | 'committee' | 'members' | 'gallery' | 'events' | 'sponsors' | 'backup'>('announcements');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Simple PIN verification
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'Taqdeer1981') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Helper State for Modal or inline Add
  const [newAnnouncement, setNewAnnouncement] = useState({ textMr: '', textEn: '', isActive: true });
  const [newCommittee, setNewCommittee] = useState({ nameMr: '', nameEn: '', roleMr: '', roleEn: '', termYear: '2026-2027', photoUrl: '', phone: '' });
  const [editingCommitteeId, setEditingCommitteeId] = useState<string | null>(null);
  
  const [newMember, setNewMember] = useState({ nameMr: '', nameEn: '', joinedYear: 2026, bloodGroup: '', phone: '', locationMr: '', locationEn: '', photoUrl: '', isLifetimeMember: false });
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const [newGallery, setNewGallery] = useState({ titleMr: '', titleEn: '', category: 'idol' as const, year: 2026, imageUrl: '' });
  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [galleryUploadType, setGalleryUploadType] = useState<'upload' | 'link'>('upload');
  const [newEvent, setNewEvent] = useState({ titleMr: '', titleEn: '', date: '2026-09-14', timeMr: 'सकाळी ८.०० वा.', timeEn: '8:00 AM', categoryMr: 'आरती', categoryEn: 'Aarti', locationMr: 'सातपाटी', locationEn: 'Satpati', isImportant: false });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    
    setIsUploadingGallery(true);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
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
      const res = await fetch('/api/announcements', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
      const saved = await res.json();
      setAnnouncements([saved, ...announcements]);
      setNewAnnouncement({ textMr: '', textEn: '', isActive: true });
    } catch (e) { console.error(e); }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch (e) { console.error(e); }
  };

  // Add or Edit Committee Member
  const handleAddCommittee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommittee.nameMr) return;

    if (editingCommitteeId) {
      try {
        const res = await fetch(`/api/committee/${editingCommitteeId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newCommittee) });
        const updated = await res.json();
        setCommittee(committee.map(c => c.id === editingCommitteeId ? updated : c));
        setEditingCommitteeId(null);
        setNewCommittee({ nameMr: '', nameEn: '', roleMr: '', roleEn: '', termYear: '2026-2027', photoUrl: '', phone: '' });
      } catch (e) { console.error(e); }
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
        const res = await fetch('/api/committee', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        const saved = await res.json();
        setCommittee([...committee, saved]);
        setNewCommittee({ nameMr: '', nameEn: '', roleMr: '', roleEn: '', termYear: '2026-2027', photoUrl: '', phone: '' });
      } catch (e) { console.error(e); }
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
      await fetch(`/api/committee/${id}`, { method: 'DELETE' });
      setCommittee(committee.filter(c => c.id !== id));
    } catch (e) { console.error(e); }
  };

  // Add or Edit Member
  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMember.nameMr) return;

    if (editingMemberId) {
      try {
        const res = await fetch(`/api/members/${editingMemberId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newMember) });
        const updated = await res.json();
        setMembers(members.map(m => m.id === editingMemberId ? updated : m));
        setEditingMemberId(null);
        setNewMember({ nameMr: '', nameEn: '', joinedYear: 2026, bloodGroup: '', phone: '', locationMr: '', locationEn: '', photoUrl: '', isLifetimeMember: false });
      } catch (e) { console.error(e); }
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
        const res = await fetch('/api/members', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        const saved = await res.json();
        setMembers([...members, saved]);
        setNewMember({ nameMr: '', nameEn: '', joinedYear: 2026, bloodGroup: '', phone: '', locationMr: '', locationEn: '', photoUrl: '', isLifetimeMember: false });
      } catch (e) { console.error(e); }
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
      await fetch(`/api/members/${id}`, { method: 'DELETE' });
      setMembers(members.filter(m => m.id !== id));
    } catch (e) { console.error(e); }
  };

  // Add or Edit Gallery Item
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.titleMr || !newGallery.imageUrl) return;
    
    if (editingGalleryId) {
      try {
        const res = await fetch(`/api/gallery/${editingGalleryId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newGallery) });
        const updated = await res.json();
        setGallery(gallery.map(g => g.id === editingGalleryId ? updated : g));
        setEditingGalleryId(null);
        setNewGallery({ titleMr: '', titleEn: '', category: 'idol', year: 2026, imageUrl: '' });
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
        imageUrl: newGallery.imageUrl
      };
      try {
        const res = await fetch('/api/gallery', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        const saved = await res.json();
        setGallery([saved, ...gallery]);
        setNewGallery({ titleMr: '', titleEn: '', category: 'idol', year: 2026, imageUrl: '' });
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
      imageUrl: g.imageUrl
    });
    setGalleryUploadType(g.imageUrl.includes('instagram.com') ? 'link' : 'upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteGallery = async (id: string) => {
    try {
      await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
      setGallery(gallery.filter(g => g.id !== id));
      showToast('फोटो डिलीट केला (Photo Deleted)');
    } catch (e) { showToast('त्रुटी (Error)'); console.error(e); }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      setEvents(events.filter(e => e.id !== id));
    } catch (e) { console.error(e); }
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
    <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-marathi">
      
      {/* Admin Top Header Bar */}
      <div className="bg-gray-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
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
            onClick={() => setIsAuthenticated(false)}
            className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors"
          >
            {t('बाहेर पडा (Logout)', 'Logout')}
          </button>
        </div>
      </div>

      {/* Admin Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('announcements')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
            activeTab === 'announcements' ? 'bg-[#FF9933] text-white shadow-xs' : 'bg-[#FAF8F5] text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Megaphone className="w-4 h-4" />
          <span>{t('सूचना फलक (Banner)', 'Announcements')}</span>
        </button>

        <button
          onClick={() => setActiveTab('committee')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
            activeTab === 'committee' ? 'bg-[#FF9933] text-white shadow-xs' : 'bg-[#FAF8F5] text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t('कार्यकारिणी (Committee)', 'Committee')}</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
            activeTab === 'members' ? 'bg-[#FF9933] text-white shadow-xs' : 'bg-[#FAF8F5] text-gray-700 hover:bg-gray-100'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>{t('सभासद (Members)', 'Members')}</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
            activeTab === 'gallery' ? 'bg-[#FF9933] text-white shadow-xs' : 'bg-[#FAF8F5] text-gray-700 hover:bg-gray-100'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t('गॅलरी (Gallery)', 'Gallery')}</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
            activeTab === 'events' ? 'bg-[#FF9933] text-white shadow-xs' : 'bg-[#FAF8F5] text-gray-700 hover:bg-gray-100'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>{t('कार्यक्रम (Events)', 'Events')}</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-2 transition-all ${
            activeTab === 'backup' ? 'bg-[#FF9933] text-white shadow-xs' : 'bg-[#FAF8F5] text-gray-700 hover:bg-gray-100'
          }`}
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t('रिसेट / रीस्टोर', 'Reset Data')}</span>
        </button>
      </div>

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
                    newGallery.category === 'instagram' ? (
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
                    setNewGallery({ titleMr: '', titleEn: '', category: 'idol', year: 2026, imageUrl: '' });
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

      {/* TAB CONTENT 4: EVENTS */}
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

      {/* TAB CONTENT 5: RESET DATA */}
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
