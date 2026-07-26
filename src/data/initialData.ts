import {
  CommitteeMember,
  DirectoryMember,
  GalleryItem,
  EventScheduleItem,
  HistoryMilestone,
  SocialActivity,
  Sponsor,
  Announcement
} from '../types';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    textMr: 'श्री गणेशोत्सव २०२६ चे भव्य नियोजन सुरू! महाआरती वेळ: दररोज सकाळी ८.०० व रात्री ८.३० वाजता.',
    textEn: 'Shree Ganeshotsav 2026 Grand Preparations Underway! Maha Aarti Daily at 8:00 AM & 8:30 PM.',
    isActive: true,
    date: '2026-07-25',
    linkSection: 'events'
  },
  {
    id: 'ann-2',
    textMr: 'वार्षिक मोफत रक्तदान व आरोग्य तपासणी शिबिर - रविवार, सातपाटी सांस्कृतिक केंद्र.',
    textEn: 'Annual Blood Donation & Health Checkup Camp - Sunday at Satpati Cultural Center.',
    isActive: true,
    date: '2026-07-20',
    linkSection: 'social'
  }
];

export const INITIAL_COMMITTEE: CommitteeMember[] = [
  {
    id: 'cm-1',
    nameMr: 'किशोर भास्कर मेहेर',
    nameEn: 'Kishor Bhaskar Meher',
    roleMr: 'अध्यक्ष',
    roleEn: 'President',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    phone: '+91 98230 12345',
    bioMr: 'मंडळाचे अध्यक्ष म्हणून खंबीर नेतृत्व आणि सर्व उपक्रमांचे मार्गदर्शन.',
    bioEn: 'President providing strong leadership and guidance for all Mandal activities.',
    order: 1,
    termYear: '2026-2027'
  },
  {
    id: 'cm-2',
    nameMr: 'प्रणय चौधरी',
    nameEn: 'Pranay Chaudhari',
    roleMr: 'उपाध्यक्ष',
    roleEn: 'Vice President',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    phone: '+91 98230 23456',
    bioMr: 'उत्सव व्यवस्थापन आणि युवा कार्यकर्त्यांचे प्रमुख आयोजक.',
    bioEn: 'Vice President organizing festival operations and youth coordination.',
    order: 2,
    termYear: '2026-2027'
  },
  {
    id: 'cm-3',
    nameMr: 'हेमचंद्र मेहेर',
    nameEn: 'Hemchandra Meher',
    roleMr: 'खजिनदार',
    roleEn: 'Treasurer',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80',
    phone: '+91 98230 34567',
    bioMr: 'पारदर्शक आर्थिक हिशोब व वार्षिक अंदाजपत्रकाचे व्यवस्थापन.',
    bioEn: 'Treasurer in charge of transparent accounts and financial planning.',
    order: 3,
    termYear: '2026-2027'
  }
];

export const INITIAL_MEMBERS: DirectoryMember[] = [
  {
    id: 'm-1',
    nameMr: 'श्री. जनमेजय भाऊ पाटील',
    nameEn: 'Mr. Janmejay Bhau Patil',
    joinedYear: 1995,
    bloodGroup: 'O+',
    phone: '+91 98230 12345',
    locationMr: 'सातपाटी बंदर, पालघर',
    locationEn: 'Satpati Bandar, Palghar',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: true
  },
  {
    id: 'm-2',
    nameMr: 'श्री. शांताराम रघुनाथ तरे',
    nameEn: 'Mr. Shantaram Raghunath Tare',
    joinedYear: 1998,
    bloodGroup: 'A+',
    phone: '+91 98230 23456',
    locationMr: 'सातपाटी कोळीवाडा',
    locationEn: 'Satpati Koliwada',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: true
  },
  {
    id: 'm-3',
    nameMr: 'श्री. प्रफुल्ल मोरेश्वर मेहेर',
    nameEn: 'Mr. Prafulla Moreshwar Meher',
    joinedYear: 2005,
    bloodGroup: 'B+',
    phone: '+91 98230 34567',
    locationMr: 'सातपाटी बीच रोड',
    locationEn: 'Satpati Beach Road',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: true
  },
  {
    id: 'm-4',
    nameMr: 'श्री. संदेश कमलाकर पाटील',
    nameEn: 'Mr. Sandesh Kamlakar Patil',
    joinedYear: 2010,
    bloodGroup: 'AB+',
    phone: '+91 98230 45678',
    locationMr: 'सातपाटी बाजारपेठ',
    locationEn: 'Satpati Market Place',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: false
  },
  {
    id: 'm-5',
    nameMr: 'श्री. देवेन्द्र पांडुरंग वाढाण',
    nameEn: 'Mr. Devendra Pandurang Wadhan',
    joinedYear: 2008,
    bloodGroup: 'O-',
    phone: '+91 98230 56789',
    locationMr: 'सातपाटी बंदर रोड',
    locationEn: 'Satpati Bandar Road',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: true
  },
  {
    id: 'm-6',
    nameMr: 'श्री. भालचंद्र गणपत मेहेर',
    nameEn: 'Mr. Bhalchandra Ganpat Meher',
    joinedYear: 1985,
    bloodGroup: 'A-',
    phone: '+91 98230 67890',
    locationMr: 'सातपाटी जुना मोहल्ला',
    locationEn: 'Satpati Old Mohalla',
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: true
  },
  {
    id: 'm-7',
    nameMr: 'सौ. सुनीता जनमेजय पाटील',
    nameEn: 'Mrs. Sunita Janmejay Patil',
    joinedYear: 2012,
    bloodGroup: 'B+',
    phone: '+91 98230 99887',
    locationMr: 'सातपाटी बंदर',
    locationEn: 'Satpati Bandar',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: true
  },
  {
    id: 'm-8',
    nameMr: 'श्री. अमोल शांताराम तरे',
    nameEn: 'Mr. Amol Shantaram Tare',
    joinedYear: 2018,
    bloodGroup: 'O+',
    phone: '+91 98230 77665',
    locationMr: 'सातपाटी कोळीवाडा',
    locationEn: 'Satpati Koliwada',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    isLifetimeMember: false
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    titleMr: 'श्रींची भव्य प्रसन्न मूर्ती - गणेशोत्सव २०२५',
    titleEn: 'Divine Lord Ganesha Idol - Ganeshotsav 2025',
    category: 'idol',
    imageUrl: '/images/img5.jpeg',
    year: 2025,
    descriptionMr: 'पारंपारिक सुवर्ण अलंकार व ताजी माळभूषा असलेली तकदीर मित्रा मंडळाची मनमोहक श्रींची मूर्ती.',
    descriptionEn: 'The awe-inspiring Ganesha idol of Taqdeer Mitra Mandal adorned in traditional golden ornaments and fresh flower garlands.'
  },
  {
    id: 'gal-2',
    titleMr: 'पारंपारिक लाकडी मखर व देखावा',
    titleEn: 'Traditional Wooden Mandap & Heritage Decoration',
    category: 'decoration',
    imageUrl: '/images/img6.jpeg',
    year: 2025,
    descriptionMr: 'सातपाटीच्या पारंपरिक कारागिरांनी साकारलेला नयनरम्य व निसर्गपूरक देखावा.',
    descriptionEn: 'Eco-friendly and traditional artisanal mandap handcrafted by local Satpati craftsmen.'
  },
  {
    id: 'gal-3',
    titleMr: 'सायंकाळची भव्य महाआरती व भाविकांची गर्दी',
    titleEn: 'Evening Grand Maha Aarti with Devotees',
    category: 'aarti',
    imageUrl: '/images/img7.jpeg',
    year: 2025,
    descriptionMr: 'शेकडो भाविकांच्या उपस्थितीत पार पडणारी श्रींची सायंकाळची आरती व मंत्रमुग्ध करणारा मंगलमय माहौल.',
    descriptionEn: 'Hundreds of devotees gather together for the enchanting evening Maha Aarti.'
  },
  {
    id: 'gal-4',
    titleMr: 'सांस्कृतिक कार्यक्रम व महिलांची मंगळागौरी',
    titleEn: 'Cultural Night & Traditional Folk Dances',
    category: 'cultural',
    imageUrl: '/images/img8.jpeg',
    year: 2024,
    descriptionMr: 'सातपाटीतील स्थानिक कलावंतांचे नृत्य, नाट्य व पारंपारिक लोककला सादरीकरण.',
    descriptionEn: 'A vibrant evening showcasing local music, drama, and traditional Maharashtrian folk dance arts.'
  },
  {
    id: 'gal-5',
    titleMr: 'वार्षिक महारक्तदान व आरोग्य तपासणी शिबिर',
    titleEn: 'Annual Mega Blood Donation Drive',
    category: 'social',
    imageUrl: '/images/img9.jpeg',
    year: 2025,
    descriptionMr: 'रेड क्रॉस सोसायटीच्या सहकार्याने २५०+ बाटल्या रक्त संकलन व १५०० ग्रामस्थांची आरोग्य तपासणी.',
    descriptionEn: 'Over 250 units of blood collected in partnership with Red Cross India along with free health checkups.'
  },
  {
    id: 'gal-6',
    titleMr: 'भव्य विसर्जन मिरवणूक व सातपाटी समुद्रकिनारा',
    titleEn: 'Grand Immersion (Visarjan) Procession at Satpati Beach',
    category: 'visarjan',
    imageUrl: '/images/img10.jpeg',
    year: 2024,
    descriptionMr: 'ढोल-ताशांच्या गजरात व गणपती बाप्पा मोरयाच्या जयघोषात सातपाटी समुद्रात विसर्जन सोहळा.',
    descriptionEn: 'A grand farewell with Dhol Tasha drums and oceanic immersion at historic Satpati seashore.'
  },
  {
    id: 'gal-7',
    titleMr: 'मंडळाचे १९८५ सालातील जुने आठवणींचे दुर्मिळ छायाचित्र',
    titleEn: 'Rare Founding Era Photograph (1985)',
    category: 'memories',
    imageUrl: '/images/img11.jpeg',
    year: 1985,
    descriptionMr: 'स्थापनेच्या पहिल्या वर्षी मंडळाचे ज्येष्ठ संस्थापक आणि पहिली श्रींची प्रतिष्ठापना.',
    descriptionEn: 'Founding mentors and the very first Ganesha installation of Taqdeer Mitra Mandal in 1985.'
  }
];

export const INITIAL_EVENTS: EventScheduleItem[] = [
  {
    id: 'evt-1',
    titleMr: 'श्रींची प्राणप्रतिष्ठापना व प्रतिष्ठापना पूजा',
    titleEn: 'Shree Ganesha Sthapana & Auspicious Prana Pratishtha',
    date: '2026-09-14',
    timeMr: 'सकाळी ९.०० वा.',
    timeEn: '9:00 AM',
    categoryMr: 'धार्मिक कार्यक्रम',
    categoryEn: 'Religious Ceremony',
    locationMr: 'तकदीर मित्र मंडळ मंडप, सातपाटी',
    locationEn: 'Taqdeer Mitra Mandal Mandap, Satpati',
    descriptionMr: 'वैदिक ब्राह्मणांच्या मंत्रघोषात व पारंपरिक वाद्यांच्या गजरात श्रींची प्रतिष्ठापना.',
    descriptionEn: 'Prana Pratishtha ritual with Vedic chants and traditional music.',
    isImportant: true
  },
  {
    id: 'evt-2',
    titleMr: 'नित्य सकाळची महाआरती व प्रसाद वितरण',
    titleEn: 'Daily Morning Maha Aarti & Prasad',
    date: '2026-09-14',
    timeMr: 'दररोज सकाळी ८.०० वा.',
    timeEn: 'Daily 8:00 AM',
    categoryMr: 'आरती व पूजा',
    categoryEn: 'Daily Aarti',
    locationMr: 'मुख्य मंडप, सातपाटी',
    locationEn: 'Main Mandap, Satpati',
    descriptionMr: 'सर्व भाविकांसाठी सकाळची मुख्य आरती आणि ताजी पंचखाद्य प्रसाद वाटप.',
    descriptionEn: 'Morning community prayer and Panchkhadya prasad distribution.'
  },
  {
    id: 'evt-3',
    titleMr: 'सायंकाळची भव्य आरती व दीपप्रज्वलन',
    titleEn: 'Daily Evening Grand Aarti & Lamp Lighting',
    date: '2026-09-14',
    timeMr: 'दररोज रात्री ८.३० वा.',
    timeEn: 'Daily 8:30 PM',
    categoryMr: 'आरती व पूजा',
    categoryEn: 'Daily Aarti',
    locationMr: 'मुख्य मंडप, सातपाटी',
    locationEn: 'Main Mandap, Satpati',
    descriptionMr: 'दीपमाळा व घंटानादाच्या मंगलमय वातावरणात सायंकाळची महाआरती.',
    descriptionEn: 'Grand evening prayer illuminated with traditional oil lamps.'
  },
  {
    id: 'evt-4',
    titleMr: 'महिला व बालकांसाठी मोदक व रांगोळी स्पर्धा',
    titleEn: 'Modak Making & Traditional Rangoli Competition',
    date: '2026-09-17',
    timeMr: 'दुपारी ४.०० ते ७.०० वा.',
    timeEn: '4:00 PM - 7:00 PM',
    categoryMr: 'सांस्कृतिक स्पर्धा',
    categoryEn: 'Cultural Contest',
    locationMr: 'सातपाटी सांस्कृतिक सभागृह',
    locationEn: 'Satpati Cultural Hall',
    descriptionMr: 'उत्कृष्ट उकडीचे मोदक व आकर्षक रांगोळी काढणाऱ्या विजेत्यांना आकर्षक बक्षीसे.',
    descriptionEn: 'Contest for traditional Ukadiche Modak and artistic Rangoli art with prizes.'
  },
  {
    id: 'evt-5',
    titleMr: 'पारंपारिक भजनी मंडळाचे हरिनाम सप्ताह व भजन',
    titleEn: 'Traditional Bhajan Night & Devotional Music',
    date: '2026-09-18',
    timeMr: 'रात्री ९.०० वाजता',
    timeEn: '9:00 PM Onwards',
    categoryMr: 'भजन व कीर्तन',
    categoryEn: 'Devotional Music',
    locationMr: 'मुख्य मंडप',
    locationEn: 'Main Mandap',
    descriptionMr: 'सातपाटी भजनी मंडळाचे सुमधुर भजन सादरीकरण व पखवाज साथ.',
    descriptionEn: 'Melodious devotional music performance by local Satpati Bhajan Mandali.'
  },
  {
    id: 'evt-6',
    titleMr: 'सर्व भाविकांसाठी महाप्रसाद अन्नछत्र',
    titleEn: 'Grand Mahaprasad Community Feast',
    date: '2026-09-20',
    timeMr: 'दुपारी १२.०० ते दुपारी ४.०० वा.',
    timeEn: '12:00 PM - 4:00 PM',
    categoryMr: 'अन्नछत्र / महाप्रसाद',
    categoryEn: 'Community Feast',
    locationMr: 'तकदीर ग्राउंड, सातपाटी',
    locationEn: 'Taqdeer Ground, Satpati',
    descriptionMr: '५,००० हून अधिक भाविकांसाठी शुध्द व स्वादिष्ट महाप्रसादाचे मोफत वाटप.',
    descriptionEn: 'Free pristine vegetarian Mahaprasad served to over 5,000 devotees.',
    isImportant: true
  },
  {
    id: 'evt-7',
    titleMr: 'श्रींचे अनंत चतुर्दशी भव्य विसर्जन सोहळा',
    titleEn: 'Anant Chaturdashi Grand Visarjan Immersion',
    date: '2026-09-24',
    timeMr: 'दुपारी ३.०० वा. मिरवणूक सुरुवात',
    timeEn: '3:00 PM Procession Onwards',
    categoryMr: 'विसर्जन सोहळा',
    categoryEn: 'Immersion Procession',
    locationMr: 'सातपाटी समुद्रकिनारा',
    locationEn: 'Satpati Beach',
    descriptionMr: 'ढोल-ताशा पथक, गुलालाची उधळण व भावपूर्ण वातावरणात सातपाटी समुद्रात विसर्जन.',
    descriptionEn: 'Emotional farewell procession featuring traditional Dhol Tasha at Satpati Beach.',
    isImportant: true
  }
];

export const INITIAL_MILESTONES: HistoryMilestone[] = [
  {
    id: 'ms-1',
    year: '१९८१ (1981)',
    titleMr: 'मंडळाची स्थापना व पहिली श्रींची स्थापना',
    titleEn: 'Establishment of Mandal & 1st Ganesha Idol',
    descriptionMr: 'सातपाटीच्या तत्कालीन तरुण व सामाजिक कार्यकर्त्यांनी एकत्रित येऊन लोकांमध्ये एकता, बंधुता व संस्कृती जपण्यासाठी "तकदीर मित्र मंडळ"ची स्थापना केली.',
    descriptionEn: 'Satpati youth and community leaders united to found Taqdeer Mitra Mandal in 1981 to promote unity, brotherhood, and cultural heritage.'
  },
  {
    id: 'ms-2',
    year: '१९९८ (1998)',
    titleMr: 'पारंपारिक लाकडी नक्षीकाम मखर उपक्रम',
    titleEn: 'Introduction of Handcrafted Wooden Mandap',
    descriptionMr: 'मंडळाने थर्माकोल व प्लास्टिकचा वापर पूर्णपणे थांबवून स्थानिक सातपाटी कारागिरांच्या हातातून घडवलेल्या शाश्वत लाकडी मखराची परंपरा सुरू केली.',
    descriptionEn: 'Mandal pledged 100% eco-friendly celebrations, replacing thermocol with traditional handcrafted wooden structures.'
  },

  {
    id: 'ms-5',
    year: '२०२५ (2025)',
    titleMr: '४० वर्षे देदीप्यमान सेवा व सामाजिक योगदान',
    titleEn: '40 Years of Glorious Legacy & Community Service',
    descriptionMr: 'मंडळाची ४० वर्षे यशस्वीपणे पूर्ण. सातपाटी समुद्रकिनारा स्वच्छता मोहीम व पर्यावरणपूरक उत्सवासाठी पालघर जिल्ह्यातील अग्रगण्य मंडळ म्हणून सन्मान.',
    descriptionEn: 'Celebrating 40 glorious years as Palghar district’s premier cultural and social organization with eco-friendly initiatives.'
  }
];

export const INITIAL_SOCIAL_ACTIVITIES: SocialActivity[] = [];

export const INITIAL_SPONSORS: Sponsor[] = [
  {
    id: 'sp-1',
    nameMr: 'सातपाटी मच्छीमार विविध कार्यकारी सहकारी संस्था लि.',
    nameEn: 'Satpati Fishermen Co-operative Society Ltd.',
    amountOrTypeMr: 'मुख्य प्रायोजक (Chief Sponsor)',
    amountOrTypeEn: 'Chief Sponsor',
    year: 2025
  },
  {
    id: 'sp-2',
    nameMr: 'पालघर मरीन सर्व्हिसेस व सप्लायर्स',
    nameEn: 'Palghar Marine Services & Suppliers',
    amountOrTypeMr: 'वर्णनीय महाप्रसाद प्रायोजक',
    amountOrTypeEn: 'Mahaprasad Sponsor',
    year: 2025
  },
  {
    id: 'sp-3',
    nameMr: 'मेहेर केटरर्स व डेकोरेटर्स, सातपाटी',
    nameEn: 'Meher Caterers & Decorators, Satpati',
    amountOrTypeMr: 'मंडप व सजावट प्रायोजक',
    amountOrTypeEn: 'Mandap & Decoration Sponsor',
    year: 2025
  },
  {
    id: 'sp-4',
    nameMr: 'श्री. गणेश ज्वेलर्स, सातपाटी बाजार',
    nameEn: 'Shree Ganesh Jewellers, Satpati Market',
    amountOrTypeMr: 'सुवर्ण पुष्पवृष्टी प्रायोजक',
    amountOrTypeEn: 'Golden Floral Sponsor',
    year: 2025
  }
];
