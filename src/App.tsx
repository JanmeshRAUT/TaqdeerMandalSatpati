import React, { useState, useEffect, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NavTab, JerseyBooking } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeSection } from './components/HomeSection';
import { HistorySection } from './components/HistorySection';
import { CommitteeSection } from './components/CommitteeSection';
import { MembersSection } from './components/MembersSection';
import { GallerySection } from './components/GallerySection';
import { EventsSection } from './components/EventsSection';
import { SocialActivitiesSection } from './components/SocialActivitiesSection';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { JerseyBookingsView } from './components/JerseyBookingsView';
import { JerseyShopPage } from './components/JerseyShopPage';
import API_BASE_URL from './config/api';

import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_COMMITTEE,
  INITIAL_MEMBERS,
  INITIAL_GALLERY,
  INITIAL_EVENTS,
  INITIAL_MILESTONES,
  INITIAL_SOCIAL_ACTIVITIES,
  INITIAL_SPONSORS
} from './data/initialData';

function AppContent() {
  const [activeTab, setActiveTab] = useState<NavTab>(() => {
    return window.location.pathname === '/admin' ? 'admin' : 'home';
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === '/admin') {
        setActiveTab('admin');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [adminPin, setAdminPin] = useState<string | null>(() => {
    return localStorage.getItem('admin_pin');
  });

  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [committee, setCommittee] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [jerseyBookings, setJerseyBookings] = useState<JerseyBooking[]>([]);
  const [settings, setSettings] = useState<any>({});
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    try {
      const headers: HeadersInit = {};
      if (adminPin) {
        headers['Authorization'] = `Bearer ${adminPin}`;
      }
      const [annRes, comRes, memRes, galRes, evtRes, milRes, actRes, spoRes, jerRes, setRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/announcements`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/committee`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/members`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/gallery`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/events`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/milestones`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/activities`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/sponsors`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/jersey-bookings`, { headers }).then(r => r.json()),
        fetch(`${API_BASE_URL}/api/settings`, { headers }).then(r => r.json())
      ]);
      setAnnouncements(Array.isArray(annRes) ? annRes : []);
      setCommittee(Array.isArray(comRes) ? comRes : []);
      setMembers(Array.isArray(memRes) ? memRes : []);
      setGallery(Array.isArray(galRes) ? galRes : []);
      setEvents(Array.isArray(evtRes) ? evtRes : []);
      setMilestones(Array.isArray(milRes) ? milRes : []);
      setActivities(Array.isArray(actRes) ? actRes : []);
      setSponsors(Array.isArray(spoRes) ? spoRes : []);
      setJerseyBookings(Array.isArray(jerRes) ? jerRes : []);
      setSettings(setRes || {});
      setIsBackendConnected(true);
    } catch (error) {
      console.error('Error fetching data from API:', error);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [adminPin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const resetAllData = () => {
    // Note: To fully reset in DB, you would need an endpoint to drop collections
    // and re-seed, but for now we reset local state to defaults.
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setCommittee(INITIAL_COMMITTEE);
    setMembers(INITIAL_MEMBERS);
    setGallery(INITIAL_GALLERY);
    setEvents(INITIAL_EVENTS);
    setMilestones(INITIAL_MILESTONES);
    setActivities(INITIAL_SOCIAL_ACTIVITIES);
    setSponsors(INITIAL_SPONSORS);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 font-marathi">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full shadow-2xl flex items-center justify-center mb-8 relative border-4 border-white">
          <div className="absolute inset-0 border-4 border-[#FF9933] border-t-transparent rounded-full animate-spin"></div>
          <img src="/images/logo.png" alt="Logo" className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md z-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#111111] mb-2 text-center">
          कृपया थोडा वेळ प्रतीक्षा करा...
        </h2>
        <h3 className="text-xl sm:text-2xl font-bold text-[#FF9933] mb-6 text-center">
          Please wait for a moment...
        </h3>
        <p className="text-gray-500 font-medium text-center max-w-md bg-white px-6 py-4 rounded-2xl shadow-sm border border-gray-100">
          वेबसाईट लोड होत आहे. यास काही सेकंद लागू शकतात. <br/>
          <span className="text-sm">The website is securely connecting to the server. This may take up to 30-50 seconds.</span>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111]">

      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        announcements={announcements.filter(a => a.isActive).length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection
            setActiveTab={setActiveTab}
            announcements={announcements}
            jerseyBookings={jerseyBookings}
            settings={settings}
            gallery={gallery}
          />
        )}

        {activeTab === 'history' && (
          <HistorySection milestones={milestones} />
        )}

        {activeTab === 'committee' && (
          <CommitteeSection committeeMembers={committee} />
        )}

        {activeTab === 'members' && (
          <MembersSection members={members} />
        )}

        {activeTab === 'gallery' && (
          <GallerySection galleryItems={gallery} />
        )}

        {activeTab === 'events' && (
          <EventsSection events={events} />
        )}

        {activeTab === 'social' && (
          <SocialActivitiesSection activities={activities} />
        )}

        {activeTab === 'contact' && (
          <ContactSection />
        )}

        {activeTab === 'jersey-bookings' && (
          <JerseyBookingsView 
            bookings={jerseyBookings} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'jersey-shop' && (
          <JerseyShopPage 
            bookings={jerseyBookings} 
            setActiveTab={setActiveTab} 
            settings={settings}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            announcements={announcements}
            setAnnouncements={setAnnouncements}
            committee={committee}
            setCommittee={setCommittee}
            members={members}
            setMembers={setMembers}
            gallery={gallery}
            setGallery={setGallery}
            events={events}
            setEvents={setEvents}
            activities={activities}
            setActivities={setActivities}
            milestones={milestones}
            setMilestones={setMilestones}
            sponsors={sponsors}
            setSponsors={setSponsors}
            jerseyBookings={jerseyBookings}
            setJerseyBookings={setJerseyBookings}
            settings={settings}
            setSettings={setSettings}
            refetchData={fetchData}
            resetAllData={resetAllData}
            adminPin={adminPin}
            setAdminPin={setAdminPin}
            isBackendConnected={isBackendConnected}
          />
        )}
      </main>


      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
