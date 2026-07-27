import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers: HeadersInit = {};
        if (adminPin) {
          headers['Authorization'] = `Bearer ${adminPin}`;
        }
        const [annRes, comRes, memRes, galRes, evtRes, milRes, actRes, spoRes, jerRes] = await Promise.all([
          fetch('/api/announcements', { headers }).then(r => r.json()),
          fetch('/api/committee', { headers }).then(r => r.json()),
          fetch('/api/members', { headers }).then(r => r.json()),
          fetch('/api/gallery', { headers }).then(r => r.json()),
          fetch('/api/events', { headers }).then(r => r.json()),
          fetch('/api/milestones', { headers }).then(r => r.json()),
          fetch('/api/activities', { headers }).then(r => r.json()),
          fetch('/api/sponsors', { headers }).then(r => r.json()),
          fetch('/api/jersey-bookings', { headers }).then(r => r.json())
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
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };
    fetchData();
  }, [adminPin]);

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
            sponsors={sponsors}
            setSponsors={setSponsors}
            jerseyBookings={jerseyBookings}
            setJerseyBookings={setJerseyBookings}
            resetAllData={resetAllData}
            adminPin={adminPin}
            setAdminPin={setAdminPin}
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
