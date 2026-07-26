import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { NavTab } from './types';
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

  const [announcements, setAnnouncements] = useState<any[]>(INITIAL_ANNOUNCEMENTS);
  const [committee, setCommittee] = useState<any[]>(INITIAL_COMMITTEE);
  const [members, setMembers] = useState<any[]>(INITIAL_MEMBERS);
  const [gallery, setGallery] = useState<any[]>(INITIAL_GALLERY);
  const [events, setEvents] = useState<any[]>(INITIAL_EVENTS);
  const [milestones, setMilestones] = useState<any[]>(INITIAL_MILESTONES);
  const [activities, setActivities] = useState<any[]>(INITIAL_SOCIAL_ACTIVITIES);
  const [sponsors, setSponsors] = useState<any[]>(INITIAL_SPONSORS);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [annRes, comRes, memRes, galRes, evtRes, milRes, actRes, spoRes] = await Promise.all([
          fetch('/api/announcements').then(r => r.json()),
          fetch('/api/committee').then(r => r.json()),
          fetch('/api/members').then(r => r.json()),
          fetch('/api/gallery').then(r => r.json()),
          fetch('/api/events').then(r => r.json()),
          fetch('/api/milestones').then(r => r.json()),
          fetch('/api/activities').then(r => r.json()),
          fetch('/api/sponsors').then(r => r.json())
        ]);
        setAnnouncements(annRes);
        setCommittee(comRes);
        setMembers(memRes);
        setGallery(galRes);
        setEvents(evtRes);
        setMilestones(milRes);
        setActivities(actRes);
        setSponsors(spoRes);
      } catch (error) {
        console.error('Error fetching data from API:', error);
      }
    };
    fetchData();
  }, []);

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
        announcementsCount={announcements.filter(a => a.isActive).length}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeSection
            setActiveTab={setActiveTab}
            announcements={announcements}
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
            resetAllData={resetAllData}
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
