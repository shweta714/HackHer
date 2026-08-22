// WaitWise Real-time API & State Management Service

const STORAGE_KEYS = {
  LOCATIONS: 'waitwise_locations_v2',
  MY_TOKENS: 'waitwise_my_tokens_v2',
  ADMIN_SESSION: 'waitwise_admin_session_v2',
  HISTORICAL_SERVED: 'waitwise_historical_served_v2'
};

// Initial Seed Data
const INITIAL_LOCATIONS = [
  {
    id: 'loc-1',
    name: 'City Care Apex Hospital',
    category: 'Healthcare & Hospital',
    icon: 'Hospital',
    address: '450 Health Ave, Metro City',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80',
    status: 'Open',
    busyLevel: 'High', // Low, Moderate, High, Critical
    avgWaitMins: 18,
    totalWaiting: 24,
    currentlyServing: 'MED-104',
    rating: 4.8,
    services: [
      { id: 'srv-101', name: 'Emergency Triage & OPD', prefix: 'MED', avgServiceMins: 8, waitingCount: 11, currentServing: 104, totalGenerated: 115 },
      { id: 'srv-102', name: 'Pathology & Diagnostics', prefix: 'LAB', avgServiceMins: 5, waitingCount: 7, currentServing: 48, totalGenerated: 55 },
      { id: 'srv-103', name: 'Pharmacy & Billing', prefix: 'PHM', avgServiceMins: 4, waitingCount: 6, currentServing: 82, totalGenerated: 88 }
    ],
    counters: [
      { id: 'c-1', name: 'Counter 1 (General OPD)', agent: 'Dr. Sharma', status: 'Serving', currentToken: 'MED-104', serviceId: 'srv-101' },
      { id: 'c-2', name: 'Counter 2 (Pediatrics)', agent: 'Dr. Alisha Khan', status: 'Serving', currentToken: 'MED-103', serviceId: 'srv-101' },
      { id: 'c-3', name: 'Counter 3 (Lab Samples)', agent: 'Technician Roy', status: 'Calling', currentToken: 'LAB-48', serviceId: 'srv-102' },
      { id: 'c-4', name: 'Counter 4 (Express Pharmacy)', agent: 'Pharmacist Priya', status: 'Available', currentToken: null, serviceId: 'srv-103' }
    ]
  },
  {
    id: 'loc-2',
    name: 'Metropolitan National Bank',
    category: 'Banking & Finance',
    icon: 'Landmark',
    address: '120 Financial Square, Suite 4',
    image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=600&auto=format&fit=crop&q=80',
    status: 'Open',
    busyLevel: 'Moderate',
    avgWaitMins: 12,
    totalWaiting: 14,
    currentlyServing: 'BNK-042',
    rating: 4.6,
    services: [
      { id: 'srv-201', name: 'Cash Deposits & Teller', prefix: 'CSH', avgServiceMins: 4, waitingCount: 6, currentServing: 75, totalGenerated: 81 },
      { id: 'srv-202', name: 'Account Opening & KYC', prefix: 'KYC', avgServiceMins: 10, waitingCount: 5, currentServing: 24, totalGenerated: 29 },
      { id: 'srv-203', name: 'Loans & Wealth Management', prefix: 'LNS', avgServiceMins: 15, waitingCount: 3, currentServing: 12, totalGenerated: 15 }
    ],
    counters: [
      { id: 'c-201', name: 'Desk 1 (Cash Desk)', agent: 'Aman Verma', status: 'Serving', currentToken: 'CSH-75', serviceId: 'srv-201' },
      { id: 'c-202', name: 'Desk 2 (Customer Support)', agent: 'Neha Kapoor', status: 'Serving', currentToken: 'KYC-24', serviceId: 'srv-202' },
      { id: 'c-203', name: 'Desk 3 (Loan Advisory)', agent: 'Rohan Gupta', status: 'Available', currentToken: null, serviceId: 'srv-203' }
    ]
  },
  {
    id: 'loc-3',
    name: 'Central Transport & DMV Center',
    category: 'Government & Public Services',
    icon: 'Building2',
    address: '89 Civic Center Blvd',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80',
    status: 'Open',
    busyLevel: 'High',
    avgWaitMins: 24,
    totalWaiting: 38,
    currentlyServing: 'DMV-210',
    rating: 4.2,
    services: [
      { id: 'srv-301', name: 'Driving License & Biometrics', prefix: 'DL', avgServiceMins: 9, waitingCount: 18, currentServing: 88, totalGenerated: 106 },
      { id: 'srv-302', name: 'Vehicle Registration & Plates', prefix: 'VR', avgServiceMins: 7, waitingCount: 14, currentServing: 52, totalGenerated: 66 },
      { id: 'srv-303', name: 'Permits & Commercial NOC', prefix: 'NOC', avgServiceMins: 12, waitingCount: 6, currentServing: 19, totalGenerated: 25 }
    ],
    counters: [
      { id: 'c-301', name: 'Window 1 (License Issuance)', agent: 'Officer John', status: 'Serving', currentToken: 'DL-88', serviceId: 'srv-301' },
      { id: 'c-302', name: 'Window 2 (Vehicle Reg)', agent: 'Officer Sunita', status: 'Serving', currentToken: 'VR-52', serviceId: 'srv-302' },
      { id: 'c-303', name: 'Window 3 (Express Verification)', agent: 'Officer Dave', status: 'Calling', currentToken: 'NOC-19', serviceId: 'srv-303' }
    ]
  },
  {
    id: 'loc-4',
    name: 'Aura Premium Salon & Spa',
    category: 'Beauty & Lifestyle',
    icon: 'Sparkles',
    address: '22 Fashion Walkway',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    status: 'Open',
    busyLevel: 'Low',
    avgWaitMins: 6,
    totalWaiting: 4,
    currentlyServing: 'SPA-015',
    rating: 4.9,
    services: [
      { id: 'srv-401', name: 'Haircut & Styling', prefix: 'CUT', avgServiceMins: 15, waitingCount: 2, currentServing: 14, totalGenerated: 16 },
      { id: 'srv-402', name: 'Skin Care & Massage', prefix: 'SPA', avgServiceMins: 25, waitingCount: 2, currentServing: 7, totalGenerated: 9 }
    ],
    counters: [
      { id: 'c-401', name: 'Stylist Chair 1', agent: 'Marco Silva', status: 'Serving', currentToken: 'CUT-14', serviceId: 'srv-401' },
      { id: 'c-402', name: 'Spa Room 1', agent: 'Elena Grace', status: 'Serving', currentToken: 'SPA-07', serviceId: 'srv-402' }
    ]
  },
  {
    id: 'loc-5',
    name: 'Saffron Grand Multi-Cuisine Dine',
    category: 'Restaurants & Dining',
    icon: 'Utensils',
    address: '77 Gourmet Street',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
    status: 'Open',
    busyLevel: 'High',
    avgWaitMins: 20,
    totalWaiting: 16,
    currentlyServing: 'TBL-030',
    rating: 4.7,
    services: [
      { id: 'srv-501', name: 'Table for 2 (Couples)', prefix: 'T2', avgServiceMins: 20, waitingCount: 8, currentServing: 18, totalGenerated: 26 },
      { id: 'srv-502', name: 'Family Table (4-6 Pax)', prefix: 'FAM', avgServiceMins: 30, waitingCount: 6, currentServing: 9, totalGenerated: 15 },
      { id: 'srv-503', name: 'VIP Rooftop Lounge', prefix: 'VIP', avgServiceMins: 35, waitingCount: 2, currentServing: 4, totalGenerated: 6 }
    ],
    counters: [
      { id: 'c-501', name: 'Host Desk A', agent: 'Hostess Tanvi', status: 'Serving', currentToken: 'T2-18', serviceId: 'srv-501' },
      { id: 'c-502', name: 'Host Desk B', agent: 'Host Vicky', status: 'Calling', currentToken: 'FAM-09', serviceId: 'srv-502' }
    ]
  }
];

// Helper to get stored state
function getStored(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    console.error('Storage parse error:', e);
    return defaultVal;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    // Dispatch custom event for cross-component reactive sync
    window.dispatchEvent(new Event('waitwise_state_change'));
  } catch (e) {
    console.error('Storage save error:', e);
  }
}

// Ensure initial data exists
if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
  setStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
}

// Initial mock user token if none exists for quick demo
if (!localStorage.getItem(STORAGE_KEYS.MY_TOKENS)) {
  const demoToken = {
    id: 'tok-demo-1',
    tokenNumber: 'MED-108',
    locationId: 'loc-1',
    locationName: 'City Care Apex Hospital',
    serviceId: 'srv-101',
    serviceName: 'Emergency Triage & OPD',
    customerName: 'Alex Johnson',
    phone: '+1 (555) 019-2834',
    partySize: 1,
    priority: 'Regular',
    notes: 'Mild fever checkup',
    issuedAt: new Date(Date.now() - 12 * 60000).toISOString(),
    status: 'WAITING', // WAITING, CALLING, SERVING, COMPLETED, CANCELLED
    estimatedWaitMins: 14,
    initialAhead: 4,
    currentAhead: 3,
    assignedCounter: 'Counter 1 (General OPD)'
  };
  setStored(STORAGE_KEYS.MY_TOKENS, [demoToken]);
}

// Web Audio API Sound Chime Generator for realistic queue chime
export const playChimeSound = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    // Pleasant airport/bank chime (Ding-Dong: F#5 then C#5)
    const playNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.3, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;
    playNote(740, now, 0.6); // F#5
    playNote(554.37, now + 0.25, 0.9); // C#5
  } catch (err) {
    console.log('Audio chime error:', err);
  }
};

// API Functions
export const api = {
  // Locations
  getLocations: async () => {
    return getStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  },

  getLocationById: async (id) => {
    const locs = getStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    return locs.find(l => l.id === id) || null;
  },

  // User: Join Queue
  joinQueue: async ({ locationId, serviceId, customerName, phone, partySize = 1, priority = 'Regular', notes = '' }) => {
    const locations = getStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    const locIndex = locations.findIndex(l => l.id === locationId);
    if (locIndex === -1) throw new Error('Location not found');

    const loc = { ...locations[locIndex] };
    const srvIndex = loc.services.findIndex(s => s.id === serviceId);
    if (srvIndex === -1) throw new Error('Service not found');

    const srv = { ...loc.services[srvIndex] };
    srv.totalGenerated += 1;
    srv.waitingCount += 1;
    loc.totalWaiting += 1;

    const tokenNumber = `${srv.prefix}-${String(srv.totalGenerated).padStart(3, '0')}`;
    const estimatedWaitMins = srv.waitingCount * srv.avgServiceMins;

    loc.services[srvIndex] = srv;
    locations[locIndex] = loc;
    setStored(STORAGE_KEYS.LOCATIONS, locations);

    const newToken = {
      id: `tok-${Date.now()}`,
      tokenNumber,
      locationId: loc.id,
      locationName: loc.name,
      serviceId: srv.id,
      serviceName: srv.name,
      customerName,
      phone,
      partySize: Number(partySize) || 1,
      priority,
      notes,
      issuedAt: new Date().toISOString(),
      status: 'WAITING',
      estimatedWaitMins,
      initialAhead: srv.waitingCount - 1,
      currentAhead: srv.waitingCount - 1,
      assignedCounter: loc.counters.find(c => c.serviceId === serviceId)?.name || 'Counter Assigned on Turn'
    };

    const myTokens = getStored(STORAGE_KEYS.MY_TOKENS, []);
    myTokens.unshift(newToken);
    setStored(STORAGE_KEYS.MY_TOKENS, myTokens);

    return newToken;
  },

  // User: Get active tickets
  getMyTokens: async () => {
    return getStored(STORAGE_KEYS.MY_TOKENS, []);
  },

  // User: Cancel Token
  cancelToken: async (tokenId) => {
    const myTokens = getStored(STORAGE_KEYS.MY_TOKENS, []);
    const updated = myTokens.map(t => {
      if (t.id === tokenId) {
        return { ...t, status: 'CANCELLED' };
      }
      return t;
    });
    setStored(STORAGE_KEYS.MY_TOKENS, updated);
    return { success: true };
  },

  // User: Delay/Push back token (e.g. +10 mins or +2 spots)
  delayToken: async (tokenId, addSpots = 2) => {
    const myTokens = getStored(STORAGE_KEYS.MY_TOKENS, []);
    const updated = myTokens.map(t => {
      if (t.id === tokenId && t.status === 'WAITING') {
        return {
          ...t,
          currentAhead: t.currentAhead + addSpots,
          estimatedWaitMins: t.estimatedWaitMins + (addSpots * 5)
        };
      }
      return t;
    });
    setStored(STORAGE_KEYS.MY_TOKENS, updated);
    return { success: true };
  },

  // Admin: Call Next Customer
  callNextToken: async (locationId, counterId) => {
    const locations = getStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    const locIndex = locations.findIndex(l => l.id === locationId);
    if (locIndex === -1) throw new Error('Location not found');

    const loc = { ...locations[locIndex] };
    const counterIndex = loc.counters.findIndex(c => c.id === counterId);
    if (counterIndex === -1) throw new Error('Counter not found');

    const counter = { ...loc.counters[counterIndex] };
    const srv = loc.services.find(s => s.id === counter.serviceId) || loc.services[0];

    // Increment currently serving
    srv.currentServing += 1;
    if (srv.waitingCount > 0) {
      srv.waitingCount -= 1;
      loc.totalWaiting = Math.max(0, loc.totalWaiting - 1);
    }

    const nextTokenNum = `${srv.prefix}-${String(srv.currentServing).padStart(3, '0')}`;
    counter.status = 'Calling';
    counter.currentToken = nextTokenNum;
    loc.currentlyServing = nextTokenNum;

    loc.counters[counterIndex] = counter;
    locations[locIndex] = loc;
    setStored(STORAGE_KEYS.LOCATIONS, locations);

    // Update user tokens if matched
    const myTokens = getStored(STORAGE_KEYS.MY_TOKENS, []);
    let matchFound = false;
    const updatedTokens = myTokens.map(tok => {
      if (tok.locationId === locationId && tok.serviceId === srv.id) {
        if (tok.tokenNumber === nextTokenNum) {
          matchFound = true;
          return { ...tok, status: 'CALLING', currentAhead: 0, assignedCounter: counter.name };
        } else if (tok.status === 'WAITING' && tok.currentAhead > 0) {
          return { ...tok, currentAhead: tok.currentAhead - 1, estimatedWaitMins: Math.max(2, tok.estimatedWaitMins - srv.avgServiceMins) };
        }
      }
      return tok;
    });
    setStored(STORAGE_KEYS.MY_TOKENS, updatedTokens);

    // Play chime sound
    playChimeSound();

    return { tokenNumber: nextTokenNum, counter: counter.name };
  },

  // Admin: Complete / Mark Served
  serveToken: async (locationId, counterId) => {
    const locations = getStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    const locIndex = locations.findIndex(l => l.id === locationId);
    if (locIndex === -1) return;

    const loc = { ...locations[locIndex] };
    const counterIndex = loc.counters.findIndex(c => c.id === counterId);
    if (counterIndex === -1) return;

    const counter = { ...loc.counters[counterIndex] };
    const servedToken = counter.currentToken;
    counter.status = 'Available';
    counter.currentToken = null;

    loc.counters[counterIndex] = counter;
    locations[locIndex] = loc;
    setStored(STORAGE_KEYS.LOCATIONS, locations);

    // Update user token if matched
    const myTokens = getStored(STORAGE_KEYS.MY_TOKENS, []);
    const updatedTokens = myTokens.map(tok => {
      if (tok.tokenNumber === servedToken) {
        return { ...tok, status: 'COMPLETED' };
      }
      return tok;
    });
    setStored(STORAGE_KEYS.MY_TOKENS, updatedTokens);

    return { success: true };
  },

  // Admin: Skip / No-show
  skipToken: async (locationId, counterId) => {
    const locations = getStored(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    const locIndex = locations.findIndex(l => l.id === locationId);
    if (locIndex === -1) return;

    const loc = { ...locations[locIndex] };
    const counter = loc.counters.find(c => c.id === counterId);
    if (!counter) return;

    const skippedToken = counter.currentToken;
    counter.status = 'Available';
    counter.currentToken = null;

    setStored(STORAGE_KEYS.LOCATIONS, locations);

    const myTokens = getStored(STORAGE_KEYS.MY_TOKENS, []);
    const updatedTokens = myTokens.map(tok => {
      if (tok.tokenNumber === skippedToken) {
        return { ...tok, status: 'MISSED' };
      }
      return tok;
    });
    setStored(STORAGE_KEYS.MY_TOKENS, updatedTokens);

    return { success: true };
  },

  // Admin: Add Walk-in
  addWalkIn: async ({ locationId, serviceId, customerName, priority }) => {
    return api.joinQueue({
      locationId,
      serviceId,
      customerName: customerName || 'Walk-in Guest',
      phone: 'N/A (Walk-in)',
      partySize: 1,
      priority: priority || 'Regular'
    });
  },

  // Admin Authentication (Simulated)
  adminLogin: async (username, password) => {
    if (password === 'admin123' || password === 'demo' || username.toLowerCase() === 'admin') {
      const session = {
        name: username === 'admin' ? 'Chief Operations Director' : username,
        role: 'SUPER_ADMIN',
        locationId: 'loc-1',
        token: `jwt-${Date.now()}`
      };
      setStored(STORAGE_KEYS.ADMIN_SESSION, session);
      return session;
    }
    throw new Error('Invalid credentials. Use demo password: admin123');
  },

  getAdminSession: () => {
    return getStored(STORAGE_KEYS.ADMIN_SESSION, null);
  },

  adminLogout: () => {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    window.dispatchEvent(new Event('waitwise_state_change'));
  },

  // Analytics Metrics
  getAnalytics: async () => {
    return {
      summary: {
        totalServedToday: 342,
        avgWaitTimeMins: 11.4,
        peakHour: '11:30 AM - 1:00 PM',
        slaCompliance: '94.2%',
        noShowRate: '3.8%',
        csatScore: '4.85 / 5.0'
      },
      hourlyTraffic: [
        { hour: '08 AM', count: 18, avgWait: 6 },
        { hour: '09 AM', count: 42, avgWait: 9 },
        { hour: '10 AM', count: 68, avgWait: 14 },
        { hour: '11 AM', count: 89, avgWait: 19 },
        { hour: '12 PM', count: 95, avgWait: 22 },
        { hour: '01 PM', count: 74, avgWait: 16 },
        { hour: '02 PM', count: 52, avgWait: 12 },
        { hour: '03 PM', count: 61, avgWait: 13 },
        { hour: '04 PM', count: 45, avgWait: 10 },
        { hour: '05 PM', count: 28, avgWait: 7 }
      ],
      departmentDistribution: [
        { name: 'Emergency OPD', percentage: 38, count: 130, color: '#10b981' },
        { name: 'Diagnostics & Lab', percentage: 25, count: 85, color: '#06b6d4' },
        { name: 'Pharmacy & Billing', percentage: 22, count: 75, color: '#8b5cf6' },
        { name: 'Specialist Consult', percentage: 15, count: 52, color: '#f59e0b' }
      ],
      counterPerformance: [
        { counter: 'Counter 1 (General OPD)', agent: 'Dr. Sharma', served: 64, avgService: '7.8 mins', satisfaction: '98%' },
        { counter: 'Counter 2 (Pediatrics)', agent: 'Dr. Alisha Khan', served: 58, avgService: '8.4 mins', satisfaction: '99%' },
        { counter: 'Counter 3 (Lab Samples)', agent: 'Technician Roy', served: 72, avgService: '4.9 mins', satisfaction: '95%' },
        { counter: 'Counter 4 (Pharmacy)', agent: 'Pharmacist Priya', served: 92, avgService: '3.8 mins', satisfaction: '97%' }
      ]
    };
  }
};
