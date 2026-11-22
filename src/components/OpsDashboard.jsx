import React, { useState, useEffect, useMemo } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  updateDoc, 
  addDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';
import {
  LayoutDashboard,
  Wallet,
  Users,
  Package,
  Building2,
  Lock,
  Unlock,
  Plus,
  Trash2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Download,
  Phone,
  MapPin,
  ExternalLink,
  RefreshCw,
  LogOut,
  ChevronRight,
  Menu,
  X,
  CreditCard,
  DollarSign,
  TrendingUp,
  Wrench,
  ShieldCheck,
  Send,
  Sparkles,
  Check,
  Smartphone,
  BookOpen,
  FileText,
  Target,
  Bell,
  Eye
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

// Purge any residual mock/dummy data from previous local test sessions
const purgeAllLegacyMockData = () => {
  if (typeof window === 'undefined') return;
  try {
    const keysToCheck = [
      'chipinn_ops_overview',
      'chipinn_ops_finances',
      'chipinn_ops_employees',
      'chipinn_ops_inventory',
      'chipinn_ops_clients',
      'chipinn_ops_milestones',
      'chipinn_ops_docs',
      'chipinn_new_order_alert'
    ];

    // One-time master reset for transition to 100% live Firestore
    if (localStorage.getItem('chipinn_ops_v6_clean') !== 'true') {
      keysToCheck.forEach((key) => localStorage.removeItem(key));
      localStorage.setItem('chipinn_ops_v6_clean', 'true');
    }

    // Explicitly scan and delete any key that contains any legacy mock text
    keysToCheck.forEach((key) => {
      const val = localStorage.getItem(key);
      if (
        val &&
        (val.includes('Unity Meter 3-in-1 (Assembled)') ||
          val.includes('Fire-Retardant Wall Enclosure Box') ||
          val.includes('STS 100A Bi-Directional Relays') ||
          val.includes('Split-Core 100A Current Transformers') ||
          val.includes('ESP32 IoT & GSM Dual-Band Module') ||
          val.includes('Fluke True-RMS Clamp Meter') ||
          val.includes('Hardware Architecture & STS Protocol') ||
          val.includes('Energy Commission of Ghana') ||
          val.includes('Non-Intrusive Load Monitoring') ||
          val.includes('Deploy First 1,000 Unity Meters') ||
          val.includes('Chipinn Sense Appliance Monitor') ||
          val.includes('GridGuard Utility Anti-Theft') ||
          val.includes('Distributed Clean Solar') ||
          val.includes('Kwesi Mensah') ||
          val.includes('Shell Spintex') ||
          val.includes('Kofi Boateng') ||
          val.includes('Emmanuel Osei') ||
          val.includes('Precision Moldings') ||
          val.includes('Akua Frimpong') ||
          val.includes('Nii Armah Tagoe') ||
          val.includes('1875'))
      ) {
        localStorage.removeItem(key);
      }
    });
  } catch {}
};

purgeAllLegacyMockData();

const INITIAL_FINANCES = [];
const INITIAL_EMPLOYEES = [];
const INITIAL_INVENTORY = [];
const INITIAL_CLIENTS = [];
const INITIAL_MILESTONES = [];
const INITIAL_DOCS = [];

export default function OpsDashboard({ onExit }) {
  // Purge any stale storage immediately on component mount
  useEffect(() => {
    purgeAllLegacyMockData();
  }, []);

  // Firebase Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('chipinn_ops_token') || '');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Tab: 'overview' | 'finances' | 'employees' | 'inventory' | 'clients' | 'docs'
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Unread Web Order Banner State
  const [newOrderAlert, setNewOrderAlert] = useState(() => {
    try {
      const saved = localStorage.getItem('chipinn_new_order_alert');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Docs Tab Sub-toggle: 'milestones' | 'docs'
  const [docsSubTab, setDocsSubTab] = useState('milestones');
  const [viewingDoc, setViewingDoc] = useState(null);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [financeAccountFilter, setFinanceAccountFilter] = useState('all');
  const [financeTypeFilter, setFinanceTypeFilter] = useState('all');

  // Persistent Data States - Real Data Only (Guaranteed zero dummy data)
  const [finances, setFinances] = useState(() => {
    try {
      const saved = localStorage.getItem('chipinn_ops_finances');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(f => 
            !f.party?.includes('Shell') && 
            !f.party?.includes('Precision') && 
            !f.description?.includes('Site inspection') &&
            !f.description?.includes('Enclosure Casing')
          );
        }
      }
      return INITIAL_FINANCES;
    } catch {
      return INITIAL_FINANCES;
    }
  });

  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('chipinn_ops_employees');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(e => 
            !e.name?.includes('Kofi Boateng') && 
            !e.name?.includes('Emmanuel Osei') && 
            !e.name?.includes('Derrick Addo') && 
            !e.name?.includes('Sarah Lamptey')
          );
        }
      }
      return INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [inventory, setInventory] = useState(() => {
    try {
      const saved = localStorage.getItem('chipinn_ops_inventory');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(i => 
            !i.item_name?.includes('Unity Meter 3-in-1 (Assembled)') && 
            !i.item_name?.includes('Fire-Retardant Wall Enclosure') && 
            !i.item_name?.includes('STS 100A') && 
            !i.item_name?.includes('Split-Core') && 
            !i.item_name?.includes('ESP32 IoT') && 
            !i.item_name?.includes('Fluke True-RMS')
          );
        }
      }
      return INITIAL_INVENTORY;
    } catch {
      return INITIAL_INVENTORY;
    }
  });

  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('chipinn_ops_clients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(c => 
            !c.name?.includes('Kwesi Mensah') && 
            !c.name?.includes('Akua Frimpong') && 
            !c.name?.includes('Nii Armah Tagoe')
          );
        }
      }
      return INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  const [milestones, setMilestones] = useState(() => {
    try {
      const saved = localStorage.getItem('chipinn_ops_milestones');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(m => 
            !m.title?.includes('Deploy First 1,000') && 
            !m.title?.includes('Chipinn Sense') && 
            !m.title?.includes('GridGuard') && 
            !m.title?.includes('Distributed Clean Solar')
          );
        }
      }
      return INITIAL_MILESTONES;
    } catch {
      return INITIAL_MILESTONES;
    }
  });

  const [docs, setDocs] = useState(() => {
    try {
      const saved = localStorage.getItem('chipinn_ops_docs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(d => 
            !d.title?.includes('Hardware Architecture') && 
            !d.title?.includes('Energy Commission') && 
            !d.title?.includes('Non-Intrusive Load Monitoring')
          );
        }
      }
      return INITIAL_DOCS;
    } catch {
      return INITIAL_DOCS;
    }
  });

  // Dynamic live computed overview from real business records
  const overview = useMemo(() => {
    let income = 0;
    let expense = 0;
    const accounts = { momo: 0, bank: 0, petty_cash: 0 };

    finances.forEach((f) => {
      const amt = Number(f.amount_ghc) || 0;
      if (f.type === 'income') {
        income += amt;
        if (accounts[f.account] !== undefined) accounts[f.account] += amt;
      } else if (f.type === 'expense') {
        expense += amt;
        if (accounts[f.account] !== undefined) accounts[f.account] -= amt;
      }
    });

    let totalMeters = 0;
    let totalOutstanding = 0;
    clients.forEach((c) => {
      totalMeters += Number(c.meters_ordered) || 0;
      totalOutstanding += Number(c.balance_due_ghc) || 0;
    });

    const lowStock = inventory.filter((i) => Number(i.quantity) <= (Number(i.min_threshold) || 0)).length;
    const activeTeam = employees.filter((e) => e.status === 'Active' || !e.status).length;
    const netProfit = income - expense;
    const totalCash = accounts.momo + accounts.bank + accounts.petty_cash;

    // Recent activity stream from real finances and live customer orders
    const recentActivity = [
      ...finances.map((f) => ({
        id: `f-${f.id}`,
        date: f.date || new Date().toISOString().slice(0, 10),
        amount_ghc: Number(f.amount_ghc) || 0,
        type: f.type,
        category: f.category || 'entry',
        account: f.account || 'momo',
        description: f.description || 'Transaction',
        party: f.party || f.reference || ''
      })),
      ...clients.map((c) => ({
        id: `c-${c.id}`,
        date: c.created_at ? c.created_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
        amount_ghc: Number(c.total_amount_ghc) || 0,
        type: 'income',
        category: 'order',
        account: 'momo',
        description: `${c.meters_ordered}x Unity Meter Order (${c.property_type || 'Residential'})`,
        party: c.name
      }))
    ].slice(0, 8);

    return {
      income_total_ghc: income,
      expense_total_ghc: expense,
      net_profit_ghc: netProfit,
      accounts_ghc: accounts,
      total_cash_ghc: totalCash,
      total_outstanding_ghc: totalOutstanding,
      total_meters_ordered: totalMeters,
      low_stock_alerts: lowStock,
      active_team_count: activeTeam,
      recent_activity: recentActivity
    };
  }, [finances, clients, inventory, employees]);

  // Modal Type: 'finance' | 'employee' | 'inventory' | 'client' | 'milestone' | 'doc'
  const [modalType, setModalType] = useState(null);

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  const dismissOrderAlert = () => {
    setNewOrderAlert(null);
    localStorage.removeItem('chipinn_new_order_alert');
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);
          localStorage.setItem('chipinn_ops_token', idToken);
        } catch {
          setToken('firebase_auth_user_' + user.uid);
        }
      } else {
        setCurrentUser(null);
        if (!localStorage.getItem('chipinn_ops_token')?.startsWith('offline_token_')) {
          setToken('');
        }
      }
      setAuthChecking(false);
    });
    return () => unsubscribe();
  }, []);

  // Authenticate via Firebase
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    const cleanEmail = emailInput.trim();
    if (!cleanEmail) {
      setAuthError('Please enter your work email address.');
      setIsAuthenticating(false);
      return;
    }
    if (!passwordInput) {
      setAuthError('Please enter your password.');
      setIsAuthenticating(false);
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, passwordInput);
      const idToken = await cred.user.getIdToken();
      setCurrentUser(cred.user);
      setToken(idToken);
      localStorage.setItem('chipinn_ops_token', idToken);
      notify(`Welcome back, ${cred.user.email}`);
    } catch (err) {
      // Emergency local fallback for offline development
      if (passwordInput === 'chipinn2026') {
        const dummyToken = 'offline_token_' + Date.now();
        localStorage.setItem('chipinn_ops_token', dummyToken);
        setToken(dummyToken);
        notify('Logged in (Local Passcode Mode)');
        setIsAuthenticating(false);
        return;
      }

      console.error('Firebase Auth error:', err);
      let errorMsg = 'Authentication failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        errorMsg = 'Incorrect email or password. Please verify your credentials or sign in with Google.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please enter a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Email/Password provider is not yet enabled in Firebase Console.';
      } else if (err.message) {
        errorMsg = err.message;
      }
      setAuthError(errorMsg);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsAuthenticating(true);
    setAuthError('');
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, provider);
      const idToken = await cred.user.getIdToken();
      setCurrentUser(cred.user);
      setToken(idToken);
      localStorage.setItem('chipinn_ops_token', idToken);
      notify(`Signed in as ${cred.user.displayName || cred.user.email}`);
    } catch (err) {
      console.error('Google Sign-in error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setAuthError(err.message || 'Google Sign-in failed. Please ensure Google provider is enabled in Firebase Console.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out:', e);
    }
    localStorage.removeItem('chipinn_ops_token');
    setToken('');
    setCurrentUser(null);
    notify('Console session closed');
  };

  // Real-time Cloud Firestore synchronization across all screens
  useEffect(() => {
    if (!token) return;
    setIsLoading(true);

    // 1. Orders / Clients
    const unsubOrders = onSnapshot(
      query(collection(db, 'orders'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        const liveOrders = snapshot.docs.map((dDoc) => {
          const d = dDoc.data();
          const amt = Number(d.amount) || 0;
          const paid = d.status === 'Paid' || d.status === 'Installed & Tested' ? amt : Number(d.amount_paid_ghc) || 0;
          const balance = d.status === 'Paid' || d.status === 'Installed & Tested' ? 0 : Math.max(0, amt - paid);
          return {
            id: dDoc.id,
            name: d.fullName || 'Web Order',
            phone: d.phone || '',
            email: d.email || '',
            location: d.location || 'Accra, Ghana',
            ghana_post_gps: d.ghanaPostGps || '',
            property_type: d.propertyType || 'Residential',
            meters_ordered: parseInt(d.units, 10) || 1,
            status: d.status || 'Pending Review',
            total_amount_ghc: amt,
            amount_paid_ghc: paid,
            balance_due_ghc: balance,
            assigned_installer_name: d.assignedInstaller || 'Unassigned (Web Lead)',
            meter_serials: d.meterSerials || 'Pending Allocation',
            notes: d.notes || d.useCase || '',
            is_live_firestore: true,
            created_at: d.clientCreatedAt || (d.createdAt?.toDate ? d.createdAt.toDate().toISOString() : new Date().toISOString())
          };
        });
        setClients(liveOrders);
        try { localStorage.setItem('chipinn_ops_clients', JSON.stringify(liveOrders)); } catch {}
      },
      (err) => console.warn('Orders listener:', err.message)
    );

    // 2. Financial Transactions
    const unsubFinances = onSnapshot(
      collection(db, 'ops_finances'),
      (snapshot) => {
        const liveFinances = snapshot.docs.map((dDoc) => ({
          id: dDoc.id,
          ...dDoc.data(),
          is_live_firestore: true
        })).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
        setFinances(liveFinances);
        try { localStorage.setItem('chipinn_ops_finances', JSON.stringify(liveFinances)); } catch {}
      },
      (err) => console.warn('Finances listener:', err.message)
    );

    // 3. Employees
    const unsubEmployees = onSnapshot(
      collection(db, 'ops_employees'),
      (snapshot) => {
        const liveEmployees = snapshot.docs.map((dDoc) => ({
          id: dDoc.id,
          ...dDoc.data(),
          is_live_firestore: true
        }));
        setEmployees(liveEmployees);
        try { localStorage.setItem('chipinn_ops_employees', JSON.stringify(liveEmployees)); } catch {}
      },
      (err) => console.warn('Employees listener:', err.message)
    );

    // 4. Inventory
    const unsubInventory = onSnapshot(
      collection(db, 'ops_inventory'),
      (snapshot) => {
        const liveInventory = snapshot.docs.map((dDoc) => ({
          id: dDoc.id,
          ...dDoc.data(),
          is_live_firestore: true
        }));
        setInventory(liveInventory);
        try { localStorage.setItem('chipinn_ops_inventory', JSON.stringify(liveInventory)); } catch {}
      },
      (err) => console.warn('Inventory listener:', err.message)
    );

    // 5. Milestones
    const unsubMilestones = onSnapshot(
      collection(db, 'ops_milestones'),
      (snapshot) => {
        const liveMilestones = snapshot.docs.map((dDoc) => ({
          id: dDoc.id,
          ...dDoc.data(),
          is_live_firestore: true
        }));
        setMilestones(liveMilestones);
        try { localStorage.setItem('chipinn_ops_milestones', JSON.stringify(liveMilestones)); } catch {}
      },
      (err) => console.warn('Milestones listener:', err.message)
    );

    // 6. Docs
    const unsubDocs = onSnapshot(
      collection(db, 'ops_docs'),
      (snapshot) => {
        const liveDocs = snapshot.docs.map((dDoc) => ({
          id: dDoc.id,
          ...dDoc.data(),
          is_live_firestore: true
        }));
        setDocs(liveDocs);
        try { localStorage.setItem('chipinn_ops_docs', JSON.stringify(liveDocs)); } catch {}
        setIsLoading(false);
      },
      (err) => {
        console.warn('Docs listener:', err.message);
        setIsLoading(false);
      }
    );

    return () => {
      unsubOrders();
      unsubFinances();
      unsubEmployees();
      unsubInventory();
      unsubMilestones();
      unsubDocs();
    };
  }, [token]);

  const fetchAllData = () => {
    // Live updates handled by Cloud Firestore listeners
  };

  // Filtered Financial Log
  const filteredFinances = useMemo(() => {
    return finances.filter(item => {
      const matchesSearch =
        searchQuery === '' ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.party && item.party.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.reference && item.reference.toLowerCase().includes(searchQuery.toLowerCase())) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesAccount = financeAccountFilter === 'all' || item.account === financeAccountFilter;
      const matchesType = financeTypeFilter === 'all' || item.type === financeTypeFilter;

      return matchesSearch && matchesAccount && matchesType;
    });
  }, [finances, searchQuery, financeAccountFilter, financeTypeFilter]);

  // Export to CSV
  const exportCSV = (data, filename) => {
    if (!data.length) return;
    const keys = Object.keys(data[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [keys.join(','), ...data.map(row => keys.map(k => `"${row[k] ?? ''}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    notify(`Exported ${filename}.csv`);
  };

  // ---------------------------------------------------------------------------
  // 1. CLEAN LOCK SCREEN
  // ---------------------------------------------------------------------------
  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        backgroundImage: 'radial-gradient(at 50% 0%, #ffffff 0%, #f1f5f9 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#0f172a',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
      }}>
        {/* Top Header Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
          <img
            src="/assets/chipinn-logo-transparent.png"
            alt="Chipinn"
            style={{ height: '36px', width: 'auto' }}
          />
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#2563eb',
            backgroundColor: '#eff6ff',
            padding: '4px 10px',
            borderRadius: '9999px',
            border: '1px solid #dbeafe'
          }}>
            Ops Console
          </span>
        </div>

        {/* Floating White Card */}
        <div style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          border: '1px solid #e2e8f0',
          padding: '44px 36px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '52px',
            height: '52px',
            borderRadius: '9999px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            marginBottom: '20px'
          }}>
            <Lock size={22} />
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '8px' }}>
            Sign in to Ops Console
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, marginBottom: '24px' }}>
            Enter your authorized administrator credentials to access back-office operations.
          </p>

          {/* 1-Click Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isAuthenticating}
            style={{
              width: '100%',
              padding: '12px 18px',
              backgroundColor: '#ffffff',
              color: '#1f2937',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              fontWeight: 600,
              fontSize: '14px',
              cursor: isAuthenticating ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s',
              marginBottom: '20px'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"/>
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>or email</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          </div>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px'
              }}>
                Work Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your authorized email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                autoFocus
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  border: authError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  backgroundColor: '#f8fafc',
                  border: authError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                  borderRadius: '10px',
                  color: '#0f172a',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {authError && (
              <div style={{
                fontSize: '13px',
                color: '#b91c1c',
                backgroundColor: '#fef2f2',
                border: '1px solid #fee2e2',
                padding: '12px 14px',
                borderRadius: '10px',
                marginBottom: '20px',
                textAlign: 'left',
                lineHeight: 1.5
              }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              style={{
                width: '100%',
                padding: '13px 24px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '14.5px',
                cursor: isAuthenticating ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)'
              }}
            >
              <span>
                {isAuthenticating ? 'Authenticating...' : 'Sign in to Ops Console'}
              </span>
              <ArrowUpRight size={17} />
            </button>
          </form>

          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '11px', color: '#94a3b8' }}>
              Firebase Auth · Chipinn Tech
            </span>
            <button
              onClick={onExit}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748b',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Back to Website
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. MAIN ULTRA-CLEAN SIDEBARED INTERFACE (SIDEBAR ONLY NAVIGATION)
  // ---------------------------------------------------------------------------
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      color: '#0f172a',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          backgroundColor: '#0f172a',
          color: '#ffffff',
          padding: '12px 22px',
          borderRadius: '9999px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} color="#22c55e" />
          <span>{notification}</span>
        </div>
      )}

      {/* --- EXCLUSIVE LEFT SIDEBAR --- */}
      <aside style={{
        width: '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 40
      }}>
        {/* Brand Header */}
        <div style={{
          height: '68px',
          padding: '0 20px',
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="/assets/chipinn-logo-transparent.png"
              alt="Chipinn"
              style={{ height: '30px', width: 'auto', display: 'block' }}
            />
            <span style={{
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: '#2563eb',
              backgroundColor: '#eff6ff',
              padding: '3px 8px',
              borderRadius: '9999px',
              border: '1px solid #dbeafe'
            }}>
              Ops
            </span>
          </div>
        </div>

        {/* Navigation Menu — Strictly in Sidebar */}
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <SidebarPill
            active={activeTab === 'overview'}
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            badge="Live"
            onClick={() => setActiveTab('overview')}
          />
          <SidebarPill
            active={activeTab === 'finances'}
            icon={<Wallet size={18} />}
            label="Finances & Cash"
            count={finances.length}
            onClick={() => setActiveTab('finances')}
          />
          <SidebarPill
            active={activeTab === 'employees'}
            icon={<Users size={18} />}
            label="Employees"
            count={employees.length}
            onClick={() => setActiveTab('employees')}
          />
          <SidebarPill
            active={activeTab === 'inventory'}
            icon={<Package size={18} />}
            label="Hardware Stock"
            alert={overview.low_stock_alerts > 0}
            count={inventory.length}
            onClick={() => setActiveTab('inventory')}
          />
          <SidebarPill
            active={activeTab === 'clients'}
            icon={<Building2 size={18} />}
            label="Clients & Orders"
            count={clients.length}
            alert={!!newOrderAlert}
            onClick={() => setActiveTab('clients')}
          />
          <SidebarPill
            active={activeTab === 'docs'}
            icon={<BookOpen size={18} />}
            label="Docs & Milestones"
            count={docs.length + milestones.length}
            onClick={() => setActiveTab('docs')}
          />
        </nav>

        {/* Live MoMo Business Float Box */}
        <div style={{
          margin: '0 12px 16px',
          padding: '16px',
          backgroundColor: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
            MoMo Business Float
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
            GH₵ {overview.accounts_ghc.momo.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
            <span>Instant settlement active</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 10px',
            backgroundColor: '#f8fafc',
            borderRadius: '10px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', maxWidth: '130px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser?.email ? currentUser.email.split('@')[0] : 'Admin Operator'}
              </span>
            </div>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Verified</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onExit}
              style={{
                flex: 1,
                padding: '9px 12px',
                fontSize: '12px',
                backgroundColor: '#ffffff',
                color: '#475467',
                border: '1px solid #d0d5dd',
                borderRadius: '9999px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Public Site
            </button>

            <button
              onClick={handleLogout}
              title="Lock Console"
              style={{
                padding: '9px 14px',
                backgroundColor: '#fef2f2',
                color: '#ef4444',
                border: '1px solid #fee2e2',
                borderRadius: '9999px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT CANVAS --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* CLEAN TOP HEADER BAR */}
        <header style={{
          height: '68px',
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Breadcrumb Navigation & Section Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
              <span style={{ color: '#64748b', fontWeight: 500 }}>Chipinn Ops</span>
              <ChevronRight size={14} color="#94a3b8" />
              <span style={{ color: '#0f172a', fontWeight: 800 }}>
                {activeTab === 'overview' && 'Executive Overview'}
                {activeTab === 'finances' && 'Financial Ledger & Cash Flow'}
                {activeTab === 'employees' && 'Company Employees'}
                {activeTab === 'inventory' && 'Hardware Stock & Parts'}
                {activeTab === 'clients' && 'Landlord Orders & Installations'}
                {activeTab === 'docs' && 'Documentation & Milestones'}
              </span>
            </div>

            <span style={{
              fontSize: '11px',
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: '9999px',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              <span>Active</span>
            </span>
          </div>

          {/* Right Header Buttons: Sync & Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={fetchAllData}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '9px 16px',
                backgroundColor: '#ffffff',
                color: '#334155',
                border: '1px solid #d0d5dd',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)'
              }}
            >
              <RefreshCw size={13} className={isLoading ? 'spin' : ''} />
              <span>{isLoading ? 'Syncing...' : 'Sync Data'}</span>
            </button>

            {/* Context-Aware Action Pill Button */}
            {activeTab === 'finances' && (
              <button onClick={() => setModalType('finance')} style={primaryPillBtnStyle}>
                <Plus size={15} />
                <span>Record Entry</span>
              </button>
            )}

            {activeTab === 'employees' && (
              <button onClick={() => setModalType('employee')} style={primaryPillBtnStyle}>
                <Plus size={15} />
                <span>Add Employee</span>
              </button>
            )}

            {activeTab === 'inventory' && (
              <button onClick={() => setModalType('inventory')} style={primaryPillBtnStyle}>
                <Plus size={15} />
                <span>Add Part / Stock</span>
              </button>
            )}

            {activeTab === 'clients' && (
              <button onClick={() => setModalType('client')} style={primaryPillBtnStyle}>
                <Plus size={15} />
                <span>New Landlord Order</span>
              </button>
            )}

            {activeTab === 'docs' && docsSubTab === 'milestones' && (
              <button onClick={() => setModalType('milestone')} style={primaryPillBtnStyle}>
                <Plus size={15} />
                <span>Add Milestone</span>
              </button>
            )}

            {activeTab === 'docs' && docsSubTab === 'docs' && (
              <button onClick={() => setModalType('doc')} style={primaryPillBtnStyle}>
                <Plus size={15} />
                <span>Add Document</span>
              </button>
            )}

            {activeTab === 'overview' && (
              <button onClick={() => setModalType('finance')} style={primaryPillBtnStyle}>
                <Plus size={15} />
                <span>Record Cash Entry</span>
              </button>
            )}
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <main style={{ padding: '36px 40px', maxWidth: '1440px', width: '100%', boxSizing: 'border-box' }}>
          {/* Real-time Web Order Alert Banner */}
          {newOrderAlert && (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1.5px solid #bfdbfe',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 14px rgba(37, 99, 235, 0.08)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Bell size={18} />
                </div>
                <div>
                  <strong style={{ fontSize: '14px', color: '#1e3a8a' }}>{newOrderAlert.title}</strong>
                  <div style={{ fontSize: '13px', color: '#1d4ed8', marginTop: '2px' }}>{newOrderAlert.message}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => { setActiveTab('clients'); dismissOrderAlert(); }}
                  style={{
                    padding: '8px 18px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '9999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  View in Orders →
                </button>
                <button
                  onClick={dismissOrderAlert}
                  style={{ padding: '6px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 1: EXECUTIVE OVERVIEW */}
          {/* =================================================================== */}
          {activeTab === 'overview' && (
            <div>
              {/* Top Banner */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '32px',
                marginBottom: '28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', backgroundColor: '#ecfdf5', borderRadius: '9999px', fontSize: '12px', fontWeight: 600, color: '#059669', marginBottom: '12px' }}>
                    <Sparkles size={13} />
                    <span>Chipinn Technologies • Ghana Operations Active</span>
                  </div>
                  <h1 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '8px' }}>
                    Executive Operations Overview
                  </h1>
                  <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '640px', lineHeight: 1.5 }}>
                    Real-time operational command center for Unity Meter deployments (GH₵1,250), MoMo transaction settlements, employee commissions, and inventory tracking.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => setActiveTab('finances')} style={primaryPillBtnStyle}>
                    View Financial Log →
                  </button>
                  <button
                    onClick={() => setActiveTab('employees')}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: '1px solid #d0d5dd',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View Employees ({employees.length})
                  </button>
                </div>
              </div>

              {/* 4 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                <CleanMetricCard
                  title="Total Cash in Hand"
                  value={`GH₵ ${overview.total_cash_ghc.toLocaleString()}`}
                  sub="MoMo, Bank & Petty Cash"
                  pill="Liquid Float"
                  pillColor="#16a34a"
                />
                <CleanMetricCard
                  title="Net Operating Balance"
                  value={`GH₵ ${overview.net_profit_ghc.toLocaleString()}`}
                  sub={`Income GH₵${overview.income_total_ghc} - Exp GH₵${overview.expense_total_ghc}`}
                  pill={overview.net_profit_ghc >= 0 ? '+ Positive' : 'Deficit'}
                  pillColor={overview.net_profit_ghc >= 0 ? '#16a34a' : '#dc2626'}
                />
                <CleanMetricCard
                  title="Unity Meters Ordered"
                  value={`${overview.total_meters_ordered} Units`}
                  sub="Flagship 3-in-1 Sub-meters"
                  pill="Stage 01"
                  pillColor="#2563eb"
                />
                <CleanMetricCard
                  title="Outstanding Balances"
                  value={`GH₵ ${overview.total_outstanding_ghc.toLocaleString()}`}
                  sub="Landlord receivables due on install"
                  pill="To Collect"
                  pillColor="#ca8a04"
                />
              </div>

              {/* Accounts & Activity Split */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Cash Accounts Box */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                      Cash Accounts (Ghana)
                    </h3>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>Live Float</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <CleanAccountCard
                      name="MTN / Telecel MoMo Business Wallet"
                      type="Primary Customer Payments"
                      balance={overview.accounts_ghc.momo}
                      color="#eab308"
                    />
                    <CleanAccountCard
                      name="Corporate Bank Account"
                      type="Stanbic / Ecobank Capital"
                      balance={overview.accounts_ghc.bank}
                      color="#2563eb"
                    />
                    <CleanAccountCard
                      name="Workshop Petty Cash"
                      type="Field Transport & Quick Tools"
                      balance={overview.accounts_ghc.petty_cash}
                      color="#059669"
                    />
                  </div>
                </div>

                {/* Recent Log Box */}
                <div style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '28px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                      Recent Activity
                    </h3>
                    <button
                      onClick={() => setActiveTab('finances')}
                      style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Open Full Log →
                    </button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {overview.recent_activity && overview.recent_activity.length > 0 ? (
                      overview.recent_activity.map((act) => (
                        <div
                          key={act.id}
                          style={{
                            padding: '14px 16px',
                            backgroundColor: '#f8fafc',
                            borderRadius: '12px',
                            border: '1px solid #f1f5f9',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{act.description}</div>
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                              {act.date} • {act.party || act.category} • <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{act.account}</span>
                            </div>
                          </div>

                          <div style={{
                            fontSize: '15px',
                            fontWeight: 700,
                            color: act.type === 'income' ? '#16a34a' : '#0f172a'
                          }}>
                            {act.type === 'income' ? '+' : '-'} GH₵ {Number(act.amount_ghc).toLocaleString()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ textAlign: 'center', padding: '36px 20px', color: '#94a3b8' }}>
                        <Clock size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#475569', margin: 0 }}>No recent activity recorded</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>Customer orders and financial transactions will appear here live in real time.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: FINANCIAL LOG & CASH FLOW */}
          {/* =================================================================== */}
          {activeTab === 'finances' && (
            <div style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '24px',
              padding: '32px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}>
              {/* Log Header & Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                marginBottom: '24px'
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '4px' }}>
                    Financial Ledger & Transaction Log
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Track all inbound customer MoMo payments, component purchases, and employee payouts.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => exportCSV(finances, 'chipinn-finances')}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: '1px solid #d0d5dd',
                      borderRadius: '9999px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>

                  <button onClick={() => setModalType('finance')} style={primaryPillBtnStyle}>
                    <Plus size={15} />
                    <span>Record Entry</span>
                  </button>
                </div>
              </div>

              {/* Clean Filter Toolbar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '14px',
                padding: '14px 18px',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                marginBottom: '24px'
              }}>
                {/* Search Input */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '9999px',
                  padding: '8px 16px',
                  width: '320px'
                }}>
                  <Search size={15} color="#94a3b8" />
                  <input
                    type="text"
                    placeholder="Search description, landlord, ref..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      border: 'none',
                      outline: 'none',
                      fontSize: '13px',
                      color: '#0f172a',
                      width: '100%'
                    }}
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Account & Type Filters */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', backgroundColor: '#ffffff', padding: '3px', borderRadius: '9999px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                    {['all', 'momo', 'bank', 'petty_cash'].map((acc) => (
                      <button
                        key={acc}
                        onClick={() => setFinanceAccountFilter(acc)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '9999px',
                          border: 'none',
                          backgroundColor: financeAccountFilter === acc ? '#0f172a' : 'transparent',
                          color: financeAccountFilter === acc ? '#ffffff' : '#64748b',
                          fontWeight: financeAccountFilter === acc ? 600 : 500,
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {acc === 'petty_cash' ? 'Cash' : acc}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: 'flex', backgroundColor: '#ffffff', padding: '3px', borderRadius: '9999px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
                    {['all', 'income', 'expense'].map((tp) => (
                      <button
                        key={tp}
                        onClick={() => setFinanceTypeFilter(tp)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '9999px',
                          border: 'none',
                          backgroundColor: financeTypeFilter === tp ? '#0f172a' : 'transparent',
                          color: financeTypeFilter === tp ? '#ffffff' : '#64748b',
                          fontWeight: financeTypeFilter === tp ? 600 : 500,
                          cursor: 'pointer',
                          textTransform: 'capitalize'
                        }}
                      >
                        {tp}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modern Data Table */}
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{
                      borderBottom: '1px solid #e2e8f0',
                      color: '#64748b',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      <th style={{ padding: '14px 16px' }}>Date</th>
                      <th style={{ padding: '14px 16px' }}>Description</th>
                      <th style={{ padding: '14px 16px' }}>Party / Client</th>
                      <th style={{ padding: '14px 16px' }}>Category</th>
                      <th style={{ padding: '14px 16px' }}>Account</th>
                      <th style={{ padding: '14px 16px' }}>Reference</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right' }}>Amount</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFinances.length > 0 ? (
                      filteredFinances.map((f) => (
                        <tr
                          key={f.id}
                          style={{
                            borderBottom: '1px solid #f1f5f9',
                            transition: 'background-color 0.15s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <td style={{ padding: '16px', color: '#64748b', whiteSpace: 'nowrap' }}>
                            {f.date}
                          </td>
                          <td style={{ padding: '16px', fontWeight: 600, color: '#0f172a' }}>
                            {f.description}
                          </td>
                          <td style={{ padding: '16px', color: '#475467' }}>
                            {f.party || '—'}
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 600,
                              backgroundColor: '#f1f5f9',
                              color: '#334155'
                            }}>
                              {(f.category || 'entry').replace('_', ' ')}
                            </span>
                          </td>
                          <td style={{ padding: '16px' }}>
                            <span style={{
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              fontSize: '11px',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              backgroundColor: f.account === 'momo' ? '#fef9c3' : f.account === 'bank' ? '#e0f2fe' : '#ecfdf5',
                              color: f.account === 'momo' ? '#a16207' : f.account === 'bank' ? '#0369a1' : '#047857'
                            }}>
                              {f.account}
                            </span>
                          </td>
                          <td style={{ padding: '16px', fontFamily: 'monospace', fontSize: '12px', color: '#64748b' }}>
                            {f.reference || '—'}
                          </td>
                          <td style={{
                            padding: '16px',
                            textAlign: 'right',
                            fontWeight: 700,
                            fontSize: '14px',
                            color: f.type === 'income' ? '#16a34a' : '#0f172a'
                          }}>
                            {f.type === 'income' ? '+' : '-'} GH₵ {Number(f.amount_ghc).toLocaleString()}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
                            <button
                              onClick={async () => {
                                if (window.confirm('Delete this financial entry?')) {
                                  const updated = finances.filter(item => item.id !== f.id);
                                  setFinances(updated);
                                  try { localStorage.setItem('chipinn_ops_finances', JSON.stringify(updated)); } catch {}
                                  try {
                                    await deleteDoc(doc(db, 'ops_finances', f.id.toString()));
                                  } catch (e) {
                                    console.warn('Delete finance:', e);
                                  }
                                  notify('Entry removed');
                                }
                              }}
                              title="Delete entry"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8' }}>
                          <Wallet size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
                          <p style={{ fontSize: '15px', fontWeight: 600, color: '#334155', margin: 0 }}>No financial entries recorded yet</p>
                          <p style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>Click "Record Entry" above to log real customer payments or expenses.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: EMPLOYEES */}
          {/* =================================================================== */}
          {activeTab === 'employees' && (
            <div>
              {/* Section Header Card */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '28px 32px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '4px' }}>
                    Company Employees & Team
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Manage engineering, hardware assembly, operations, and field logistics staff. Track salaries and performance payouts.
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '8px 16px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '9999px',
                    border: '1px solid #e2e8f0',
                    fontSize: '13px'
                  }}>
                    <span>Active Team: <strong style={{ color: '#0f172a' }}>{employees.length}</strong></span>
                    <span style={{ color: '#cbd5e1' }}>•</span>
                    <span>Total Units Handled: <strong style={{ color: '#0f172a' }}>{employees.reduce((acc, e) => acc + (e.meters_installed_count || 0), 0)}</strong></span>
                  </div>

                  <button onClick={() => setModalType('employee')} style={primaryPillBtnStyle}>
                    <Plus size={15} />
                    <span>Add Employee</span>
                  </button>
                </div>
              </div>

              {/* Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {employees.length > 0 ? (
                  employees.map((emp) => (
                    <div
                      key={emp.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '9999px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '14px'
                          }}>
                            {(emp.name || 'Team').split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{emp.name}</h3>
                            <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>{emp.role}</div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            fontSize: '11px',
                            padding: '3px 8px',
                            borderRadius: '9999px',
                            backgroundColor: emp.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                            color: emp.status === 'Active' ? '#059669' : '#64748b',
                            fontWeight: 600
                          }}>
                            {emp.status || 'Active'}
                          </span>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Remove employee ${emp.name}?`)) {
                                const updated = employees.filter(e => e.id !== emp.id);
                                setEmployees(updated);
                                try { localStorage.setItem('chipinn_ops_employees', JSON.stringify(updated)); } catch {}
                                try { await deleteDoc(doc(db, 'ops_employees', emp.id.toString())); } catch {}
                                notify(`Removed ${emp.name}`);
                              }
                            }}
                            title="Remove employee"
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Phone size={13} color="#94a3b8" />
                          <span>{emp.phone || 'No phone'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={13} color="#94a3b8" />
                          <span>Department: {emp.department || emp.zone || 'Operations'}</span>
                        </div>
                        {emp.ghana_card && (
                          <div>
                            Ghana Card: <code style={{ color: '#0f172a', fontWeight: 600 }}>{emp.ghana_card}</code>
                          </div>
                        )}
                      </div>

                      {/* Compensation & Commission Box */}
                      <div style={{
                        backgroundColor: '#f8fafc',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        border: '1px solid #f1f5f9',
                        marginBottom: '16px'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                          <span style={{ color: '#64748b' }}>Base Monthly Salary:</span>
                          <strong style={{ color: '#0f172a' }}>GH₵ {(Number(emp.base_salary_ghc) || 0).toLocaleString()}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: '#64748b' }}>Performance / Commission:</span>
                          <strong style={{ color: '#16a34a', fontSize: '13px' }}>
                            GH₵ {((Number(emp.meters_installed_count) || 0) * (Number(emp.commission_per_meter_ghc) || 0)).toLocaleString()}
                          </strong>
                        </div>
                      </div>

                      {/* Action Pills */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={async () => {
                            const newCount = (Number(emp.meters_installed_count) || 0) + 1;
                            const updated = employees.map(item =>
                              item.id === emp.id ? { ...item, meters_installed_count: newCount } : item
                            );
                            setEmployees(updated);
                            try { localStorage.setItem('chipinn_ops_employees', JSON.stringify(updated)); } catch {}
                            try {
                              await updateDoc(doc(db, 'ops_employees', emp.id.toString()), {
                                meters_installed_count: newCount
                              });
                            } catch (e) {
                              console.warn('Update employee:', e);
                            }
                            notify(`Recorded +1 completed unit for ${emp.name}`);
                          }}
                          style={{
                            flex: 1,
                            padding: '10px 14px',
                            backgroundColor: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '9999px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          + 1 Unit Handled
                        </button>

                        {emp.phone && (
                          <a
                            href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              padding: '10px 14px',
                              backgroundColor: '#ecfdf5',
                              color: '#059669',
                              borderRadius: '9999px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              textDecoration: 'none',
                              fontSize: '12px',
                              fontWeight: 600
                            }}
                          >
                            <Send size={13} />
                            <span>WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px dashed #cbd5e1'
                  }}>
                    <Users size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No Team Members Registered</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px' }}>
                      Add your electrical engineers, field installers, assembly techs, and sales staff to manage roles and commissions.
                    </p>
                    <button onClick={() => setModalType('employee')} style={primaryPillBtnStyle}>
                      <Plus size={15} />
                      <span>Add First Team Member</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: HARDWARE INVENTORY & STOCK */}
          {/* =================================================================== */}
          {activeTab === 'inventory' && (
            <div>
              {/* Header Box */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '28px 32px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '4px' }}>
                    Hardware Inventory & Parts Vault
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Monitor raw electronic components (relays, CT sensors, enclosures) and assembled Unity Meters ready for installation.
                  </p>
                </div>

                <button onClick={() => setModalType('inventory')} style={primaryPillBtnStyle}>
                  <Plus size={15} />
                  <span>Add Stock Part</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {inventory.length > 0 ? (
                  inventory.map((item) => {
                    const isLow = Number(item.quantity) <= Number(item.min_threshold);
                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: isLow ? '1.5px solid #fecaca' : '1px solid #e2e8f0',
                          borderRadius: '20px',
                          padding: '24px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>{item.item_name}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {isLow && (
                              <span style={{ fontSize: '10px', backgroundColor: '#fef2f2', color: '#b91c1c', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                                LOW STOCK
                              </span>
                            )}
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete ${item.item_name}?`)) {
                                  const updated = inventory.filter(i => i.id !== item.id);
                                  setInventory(updated);
                                  try { localStorage.setItem('chipinn_ops_inventory', JSON.stringify(updated)); } catch {}
                                  try { await deleteDoc(doc(db, 'ops_inventory', item.id.toString())); } catch {}
                                  notify(`Deleted ${item.item_name}`);
                                }
                              }}
                              title="Delete stock item"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                          Location: {item.location || 'Lab'} • Cost: GH₵ {item.unit_cost_ghc || 0}
                        </div>

                        {/* Stock Stepper Box */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          backgroundColor: '#f8fafc',
                          borderRadius: '12px',
                          marginBottom: '16px'
                        }}>
                          <div>
                            <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>In Stock</div>
                            <div style={{ fontSize: '22px', fontWeight: 800, color: isLow ? '#dc2626' : '#0f172a' }}>
                              {item.quantity || 0} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>{item.unit || 'units'}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={async () => {
                                const newQty = Math.max(0, (Number(item.quantity) || 0) - 1);
                                const updated = inventory.map(i => i.id === item.id ? { ...i, quantity: newQty } : i);
                                setInventory(updated);
                                try { localStorage.setItem('chipinn_ops_inventory', JSON.stringify(updated)); } catch {}
                                try {
                                  await updateDoc(doc(db, 'ops_inventory', item.id.toString()), { quantity: newQty });
                                } catch (e) {
                                  console.warn('Update inventory:', e);
                                }
                              }}
                              style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', border: '1px solid #d0d5dd', color: '#0f172a', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
                            >
                              -
                            </button>
                            <button
                              onClick={async () => {
                                const newQty = (Number(item.quantity) || 0) + 1;
                                const updated = inventory.map(i => i.id === item.id ? { ...i, quantity: newQty } : i);
                                setInventory(updated);
                                try { localStorage.setItem('chipinn_ops_inventory', JSON.stringify(updated)); } catch {}
                                try {
                                  await updateDoc(doc(db, 'ops_inventory', item.id.toString()), { quantity: newQty });
                                } catch (e) {
                                  console.warn('Update inventory:', e);
                                }
                              }}
                              style={{ width: '32px', height: '32px', backgroundColor: '#0f172a', border: 'none', color: '#ffffff', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                          <span>Alert at &le; {item.min_threshold || 5} {item.unit || 'units'}</span>
                          <span>Total Asset: GH₵ {((Number(item.quantity) || 0) * (Number(item.unit_cost_ghc) || 0)).toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '60px 20px',
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    border: '1px dashed #cbd5e1'
                  }}>
                    <Package size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No Inventory Recorded</h3>
                    <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '420px', margin: '0 auto 18px' }}>
                      Add assembled Unity Meters, enclosure casings, relays, current transformers, and installation tools.
                    </p>
                    <button onClick={() => setModalType('inventory')} style={primaryPillBtnStyle}>
                      <Plus size={15} />
                      <span>Add Stock Part</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 5: CLIENTS & ORDERS */}
          {/* =================================================================== */}
          {activeTab === 'clients' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Header Box */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '28px 32px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '4px' }}>
                    Landlord Orders & Deployment Pipeline
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Live customer orders from website and field sales. Tracks MoMo settlements, balances, and technician dispatch.
                  </p>
                </div>

                <button onClick={() => setModalType('client')} style={primaryPillBtnStyle}>
                  <Plus size={15} />
                  <span>New Landlord Order</span>
                </button>
              </div>

              {clients.length > 0 ? (
                clients.map((cli) => {
                  const hasBalance = cli.balance_due_ghc > 0;
                  return (
                    <div
                      key={cli.id}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '20px',
                        padding: '24px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{cli.name}</h3>
                            <span style={{
                              fontSize: '11px',
                              padding: '4px 10px',
                              borderRadius: '9999px',
                              backgroundColor: cli.status.includes('Paid') || cli.status.includes('Installed') ? '#ecfdf5' : '#fef9c3',
                              color: cli.status.includes('Paid') || cli.status.includes('Installed') ? '#059669' : '#a16207',
                              fontWeight: 700
                            }}>
                              {cli.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#2563eb', fontWeight: 500, marginTop: '2px' }}>
                            {cli.property_type} • {cli.meters_ordered} Unity Meter(s)
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a' }}>
                            GH₵ {(Number(cli.total_amount_ghc) || 0).toLocaleString()}
                          </div>
                          <div style={{ fontSize: '12px', color: hasBalance ? '#ca8a04' : '#16a34a', fontWeight: 600 }}>
                            {hasBalance ? `Balance: GH₵ ${Number(cli.balance_due_ghc).toLocaleString()}` : 'Paid in Full ✓'}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', color: '#64748b', marginBottom: '18px' }}>
                        <div>
                          Location: <strong style={{ color: '#0f172a' }}>{cli.location}</strong>
                        </div>
                        <div>
                          GPS: <code style={{ color: '#2563eb', fontWeight: 600 }}>{cli.ghana_post_gps || '—'}</code>
                        </div>
                        <div>
                          Installer: <strong style={{ color: '#0f172a' }}>{cli.assigned_installer_name || 'Unassigned'}</strong>
                        </div>
                        <div>
                          Serial: <code style={{ color: '#7c3aed', fontWeight: 600 }}>{cli.meter_serials || 'Pending Allocation'}</code>
                        </div>
                      </div>

                      {cli.notes && (
                        <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '16px', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '10px' }}>
                          "{cli.notes}"
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        {cli.phone && (
                          <>
                            <a
                              href={`tel:${cli.phone}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                backgroundColor: '#ffffff',
                                color: '#334155',
                                border: '1px solid #d0d5dd',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none'
                              }}
                            >
                              <Phone size={13} />
                              <span>{cli.phone}</span>
                            </a>

                            <a
                              href={`https://wa.me/${cli.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                backgroundColor: '#ecfdf5',
                                color: '#059669',
                                borderRadius: '9999px',
                                fontSize: '12px',
                                fontWeight: 600,
                                textDecoration: 'none'
                              }}
                            >
                              <Send size={13} />
                              <span>WhatsApp Landlord</span>
                            </a>
                          </>
                        )}

                        {cli.status !== 'Installed & Tested' && (
                          <button
                            onClick={async () => {
                              const updated = clients.map(c => c.id === cli.id ? { ...c, status: 'Installed & Tested', amount_paid_ghc: c.total_amount_ghc, balance_due_ghc: 0 } : c);
                              setClients(updated);
                              try { localStorage.setItem('chipinn_ops_clients', JSON.stringify(updated)); } catch {}
                              try {
                                await updateDoc(doc(db, 'orders', cli.id.toString()), {
                                  status: 'Installed & Tested',
                                  amount_paid_ghc: cli.total_amount_ghc,
                                  balance_due_ghc: 0,
                                  updatedAt: serverTimestamp()
                                });
                              } catch (e) {
                                console.warn('Update order status:', e);
                              }
                              notify(`Marked order for ${cli.name} as Installed & Tested`);
                            }}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#0f172a',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: '9999px',
                              fontSize: '12px',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Mark Installed & Paid
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '60px 20px',
                  backgroundColor: '#ffffff',
                  borderRadius: '20px',
                  border: '1px dashed #cbd5e1'
                }}>
                  <Building2 size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No Customer Orders Yet</h3>
                  <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '440px', margin: '0 auto 18px' }}>
                    Customer orders placed via the website Order modal stream directly into this dashboard in real-time. You can also manually register offline field orders.
                  </p>
                  <button onClick={() => setModalType('client')} style={primaryPillBtnStyle}>
                    <Plus size={15} />
                    <span>Register Landlord Order</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 6: DOCS & MILESTONES (NEW MODULE) */}
          {/* =================================================================== */}
          {activeTab === 'docs' && (
            <div>
              {/* Header Box with Sub-tabs */}
              <div style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '20px',
                padding: '28px 32px',
                marginBottom: '24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}>
                <div>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a', marginBottom: '4px' }}>
                    Product Documentation, Research & Milestones
                  </h2>
                  <p style={{ fontSize: '13px', color: '#64748b' }}>
                    Repository for hardware technical schematics, regulatory filings, AI research notes, and 3-year strategic milestones.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '8px', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '9999px', border: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => setDocsSubTab('milestones')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: docsSubTab === 'milestones' ? '#0f172a' : 'transparent',
                      color: docsSubTab === 'milestones' ? '#ffffff' : '#64748b',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    3-Year Milestones ({milestones.length})
                  </button>
                  <button
                    onClick={() => setDocsSubTab('docs')}
                    style={{
                      padding: '8px 18px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: docsSubTab === 'docs' ? '#0f172a' : 'transparent',
                      color: docsSubTab === 'docs' ? '#ffffff' : '#64748b',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Technical Docs & Research ({docs.length})
                  </button>
                </div>
              </div>

              {/* Sub-tab 1: Milestones */}
              {docsSubTab === 'milestones' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                  {milestones.length > 0 ? (
                    milestones.map((m) => (
                      <div
                        key={m.id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '20px',
                          padding: '24px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <span style={{
                            fontSize: '11px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '9999px',
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            textTransform: 'uppercase'
                          }}>
                            {m.stage}
                          </span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              color: m.status === 'Completed' ? '#16a34a' : m.status === 'In Progress' ? '#2563eb' : '#64748b'
                            }}>
                              {m.status} • {m.target_date}
                            </span>
                            <button
                              onClick={async () => {
                                if (window.confirm(`Delete milestone "${m.title}"?`)) {
                                  const updated = milestones.filter(item => item.id !== m.id);
                                  setMilestones(updated);
                                  try { localStorage.setItem('chipinn_ops_milestones', JSON.stringify(updated)); } catch {}
                                  try { await deleteDoc(doc(db, 'ops_milestones', m.id.toString())); } catch {}
                                  notify('Milestone deleted');
                                }
                              }}
                              title="Delete milestone"
                              style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                          {m.title}
                        </h3>
                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '20px' }}>
                          {m.description}
                        </p>

                        {/* Progress Bar */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '6px' }}>
                            <span style={{ color: '#64748b' }}>Execution Progress</span>
                            <span style={{ color: '#0f172a' }}>{m.progress_percent}%</span>
                          </div>
                          <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${m.progress_percent}%`,
                              height: '100%',
                              backgroundColor: m.progress_percent > 50 ? '#16a34a' : '#2563eb',
                              borderRadius: '9999px'
                            }} />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: '60px 20px',
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1px dashed #cbd5e1'
                    }}>
                      <Clock size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No Milestones Defined Yet</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '440px', margin: '0 auto 18px' }}>
                        Set 3-year strategic pillars and engineering milestones for Chipinn Technologies.
                      </p>
                      <button onClick={() => setModalType('milestone')} style={primaryPillBtnStyle}>
                        <Plus size={15} />
                        <span>Add Strategic Milestone</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Sub-tab 2: Docs & Research */}
              {docsSubTab === 'docs' && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
                  {docs.length > 0 ? (
                    docs.map((d) => (
                      <div
                        key={d.id}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '20px',
                          padding: '24px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 700,
                              padding: '3px 10px',
                              borderRadius: '9999px',
                              backgroundColor: d.category === 'hardware_spec' ? '#eff6ff' : d.category === 'regulatory_compliance' ? '#fefce8' : '#f5f3ff',
                              color: d.category === 'hardware_spec' ? '#2563eb' : d.category === 'regulatory_compliance' ? '#a16207' : '#7c3aed'
                            }}>
                              {(d.category || 'spec').replace('_', ' ')}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '11px', color: '#94a3b8' }}>By {d.author}</span>
                              <button
                                onClick={async () => {
                                  if (window.confirm(`Delete document "${d.title}"?`)) {
                                    const updated = docs.filter(item => item.id !== d.id);
                                    setDocs(updated);
                                    try { localStorage.setItem('chipinn_ops_docs', JSON.stringify(updated)); } catch {}
                                    try { await deleteDoc(doc(db, 'ops_docs', d.id.toString())); } catch {}
                                    notify('Document deleted');
                                  }
                                }}
                                title="Delete document"
                                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '2px' }}
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>

                          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginBottom: '8px', lineHeight: 1.4 }}>
                            {d.title}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, marginBottom: '16px' }}>
                            {d.summary}
                          </p>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '14px' }}>
                            Tags: <code style={{ color: '#0f172a' }}>{d.tags}</code>
                          </div>

                          <button
                            onClick={() => setViewingDoc(d)}
                            style={{
                              width: '100%',
                              padding: '10px',
                              backgroundColor: '#f8fafc',
                              color: '#0f172a',
                              border: '1px solid #e2e8f0',
                              borderRadius: '9999px',
                              fontSize: '13px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Eye size={14} />
                            <span>View Full Notes & Specs</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{
                      gridColumn: '1 / -1',
                      textAlign: 'center',
                      padding: '60px 20px',
                      backgroundColor: '#ffffff',
                      borderRadius: '20px',
                      border: '1px dashed #cbd5e1'
                    }}>
                      <ExternalLink size={40} style={{ margin: '0 auto 12px', color: '#94a3b8' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>No Documentation Published Yet</h3>
                      <p style={{ fontSize: '13px', color: '#64748b', maxWidth: '440px', margin: '0 auto 18px' }}>
                        Publish hardware schematics, firmware notes, regulatory submissions, or research whitepapers.
                      </p>
                      <button onClick={() => setModalType('doc')} style={primaryPillBtnStyle}>
                        <Plus size={15} />
                        <span>Publish Technical Document</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* MODAL DIALOGS */}
          {/* =================================================================== */}
          {modalType && (
            <CleanModalWrapper
              title={
                modalType === 'finance' ? 'Record Financial Transaction' :
                modalType === 'employee' ? 'Add New Employee' :
                modalType === 'inventory' ? 'Add Hardware Stock Part' :
                modalType === 'milestone' ? 'Add 3-Year Strategic Milestone' :
                modalType === 'doc' ? 'Publish Technical Document / Research' :
                'Register Landlord Order'
              }
              onClose={() => setModalType(null)}
            >
              {modalType === 'finance' && (
                <FinanceForm
                  token={token}
                  onSuccess={(newItem) => {
                    if (newItem) setFinances([newItem, ...finances]);
                    setModalType(null);
                    fetchAllData();
                    notify('Entry recorded');
                  }}
                />
              )}
              {modalType === 'employee' && (
                <EmployeeForm
                  token={token}
                  onSuccess={(newEmp) => {
                    if (newEmp) setEmployees([...employees, newEmp]);
                    setModalType(null);
                    fetchAllData();
                    notify('Employee added');
                  }}
                />
              )}
              {modalType === 'inventory' && (
                <InventoryForm
                  token={token}
                  onSuccess={(newInv) => {
                    if (newInv) setInventory([...inventory, newInv]);
                    setModalType(null);
                    fetchAllData();
                    notify('Stock item saved');
                  }}
                />
              )}
              {modalType === 'client' && (
                <ClientForm
                  token={token}
                  onSuccess={(newCli) => {
                    if (newCli) setClients([newCli, ...clients]);
                    setModalType(null);
                    fetchAllData();
                    notify('Order registered');
                  }}
                />
              )}
              {modalType === 'milestone' && (
                <MilestoneForm
                  token={token}
                  onSuccess={(newM) => {
                    if (newM) setMilestones([...milestones, newM]);
                    setModalType(null);
                    fetchAllData();
                    notify('Milestone published');
                  }}
                />
              )}
              {modalType === 'doc' && (
                <DocForm
                  token={token}
                  onSuccess={(newD) => {
                    if (newD) setDocs([newD, ...docs]);
                    setModalType(null);
                    fetchAllData();
                    notify('Document published');
                  }}
                />
              )}
            </CleanModalWrapper>
          )}

          {/* Full Doc Viewer Modal */}
          {viewingDoc && (
            <CleanModalWrapper title={viewingDoc.title} onClose={() => setViewingDoc(null)}>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                Category: <strong>{viewingDoc.category}</strong> • Author: <strong>{viewingDoc.author}</strong>
              </div>
              <div style={{
                backgroundColor: '#f8fafc',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid #e2e8f0',
                fontSize: '14px',
                lineHeight: 1.7,
                color: '#1e293b',
                whiteSpace: 'pre-line',
                maxHeight: '60vh',
                overflowY: 'auto'
              }}>
                {viewingDoc.content}
              </div>
            </CleanModalWrapper>
          )}
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS & FORMS
// ---------------------------------------------------------------------------

const primaryPillBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 20px',
  backgroundColor: '#0f172a',
  color: '#ffffff',
  border: 'none',
  borderRadius: '9999px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
  boxShadow: '0 2px 8px rgba(15, 23, 42, 0.15)',
  transition: 'background-color 0.2s'
};

function SidebarPill({ active, icon, label, badge, count, alert, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '11px 14px',
        borderRadius: '9999px',
        border: 'none',
        backgroundColor: active ? '#0f172a' : 'transparent',
        color: active ? '#ffffff' : '#475467',
        fontWeight: active ? 700 : 500,
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = '#f1f5f9';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon}
        <span>{label}</span>
      </div>
      {badge && (
        <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '9999px', fontWeight: 700 }}>
          {badge}
        </span>
      )}
      {count !== undefined && (
        <span style={{
          fontSize: '11px',
          padding: '2px 7px',
          borderRadius: '9999px',
          backgroundColor: active ? '#1e293b' : '#f1f5f9',
          color: active ? '#cbd5e1' : '#64748b',
          fontWeight: 600
        }}>
          {count}
        </span>
      )}
      {alert && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />}
    </button>
  );
}

function CleanMetricCard({ title, value, sub, pill, pillColor }) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '20px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>{title}</span>
        {pill && (
          <span style={{
            fontSize: '11px',
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: '9999px',
            backgroundColor: `${pillColor}15`,
            color: pillColor
          }}>
            {pill}
          </span>
        )}
      </div>
      <div style={{ fontSize: '26px', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '6px' }}>
        {value}
      </div>
      <div style={{ fontSize: '12px', color: '#94a3b8' }}>{sub}</div>
    </div>
  );
}

function CleanAccountCard({ name, type, balance, color }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 18px',
      backgroundColor: '#f8fafc',
      border: '1px solid #f1f5f9',
      borderRadius: '14px'
    }}>
      <div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a' }}>{name}</div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>{type}</div>
      </div>
      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
        GH₵ {balance.toLocaleString()}
      </div>
    </div>
  );
}

function CleanModalWrapper({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.4)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '24px',
        padding: '32px',
        width: '100%',
        maxWidth: '540px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9999px',
              backgroundColor: '#f1f5f9',
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#64748b',
              cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Clean Forms
function FinanceForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    amount_ghc: '',
    type: 'income',
    category: 'meter_sale',
    account: 'momo',
    description: '',
    party: '',
    reference: ''
  });

  const setPreset = (amt, desc, cat, type) => {
    setFormData({ ...formData, amount_ghc: amt.toString(), description: desc, category: cat, type: type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      amount_ghc: parseFloat(formData.amount_ghc) || 0,
      date: new Date().toISOString().slice(0, 10),
      createdAt: serverTimestamp()
    };
    let docId = Date.now().toString();
    try {
      const docRef = await addDoc(collection(db, 'ops_finances'), payload);
      docId = docRef.id;
    } catch (err) {
      console.warn('Firestore write finance fallback:', err);
    }
    onSuccess({ ...payload, id: docId });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Quick Amount Presets */}
      <div>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#64748b', marginBottom: '6px' }}>Quick Presets</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setPreset(1250, '1x Unity Meter Sale', 'meter_sale', 'income')}
            style={presetBtnStyle}
          >
            1x Meter (GH₵1,250)
          </button>
          <button
            type="button"
            onClick={() => setPreset(2500, '2x Unity Meters Sale', 'meter_sale', 'income')}
            style={presetBtnStyle}
          >
            2x Meters (GH₵2,500)
          </button>
          <button
            type="button"
            onClick={() => setPreset(625, '50% Pre-Order Deposit', 'deposit', 'income')}
            style={presetBtnStyle}
          >
            50% Deposit (GH₵625)
          </button>
          <button
            type="button"
            onClick={() => setPreset(120, 'Installer Commission Payout', 'technician_payout', 'expense')}
            style={presetBtnStyle}
          >
            Install Fee (GH₵120)
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Entry Type</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'income' })}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: formData.type === 'income' ? '#0f172a' : '#f1f5f9',
              color: formData.type === 'income' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Income (+)
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'expense' })}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '9999px',
              border: 'none',
              backgroundColor: formData.type === 'expense' ? '#0f172a' : '#f1f5f9',
              color: formData.type === 'expense' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Expense (-)
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Amount (GH₵)</label>
        <input
          type="number"
          step="0.01"
          required
          placeholder="e.g. 1250"
          value={formData.amount_ghc}
          onChange={(e) => setFormData({ ...formData, amount_ghc: e.target.value })}
          style={cleanInputStyle}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Account</label>
        <select
          value={formData.account}
          onChange={(e) => setFormData({ ...formData, account: e.target.value })}
          style={cleanInputStyle}
        >
          <option value="momo">MTN / Telecel / AT MoMo Wallet</option>
          <option value="bank">Bank Account (Ecobank / Stanbic)</option>
          <option value="petty_cash">Petty Cash</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Description</label>
        <input
          type="text"
          required
          placeholder="e.g. Unity Meter purchase for East Legon"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={cleanInputStyle}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Landlord / Client / Vendor</label>
        <input
          type="text"
          placeholder="e.g. Kwesi Mensah"
          value={formData.party}
          onChange={(e) => setFormData({ ...formData, party: e.target.value })}
          style={cleanInputStyle}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Reference / MoMo ID</label>
        <input
          type="text"
          placeholder="e.g. MTN-94810294"
          value={formData.reference}
          onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
          style={cleanInputStyle}
        />
      </div>

      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '8px' }}>
        Save Transaction
      </button>
    </form>
  );
}

function EmployeeForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Lead Electrical Engineer',
    department: 'Engineering & Hardware',
    phone: '',
    momo_number: '',
    ghana_card: '',
    zone: 'Accra Central',
    base_salary_ghc: 3500,
    commission_per_meter_ghc: 120
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      base_salary_ghc: parseFloat(formData.base_salary_ghc) || 0,
      commission_per_meter_ghc: parseFloat(formData.commission_per_meter_ghc) || 0,
      meters_installed_count: 0,
      status: 'Active',
      employment_type: 'Full-time',
      createdAt: serverTimestamp()
    };
    let docId = Date.now().toString();
    try {
      const docRef = await addDoc(collection(db, 'ops_employees'), payload);
      docId = docRef.id;
    } catch (err) {
      console.warn('Firestore write employee fallback:', err);
    }
    onSuccess({ ...payload, id: docId });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Employee Full Name</label>
        <input required type="text" placeholder="e.g. Kofi Boateng" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={cleanInputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Job Role</label>
          <input required type="text" placeholder="e.g. Hardware Engineer" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={cleanInputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Department</label>
          <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} style={cleanInputStyle}>
            <option value="Engineering & Hardware">Engineering & Hardware</option>
            <option value="Field Operations">Field Operations</option>
            <option value="Assembly & QA">Assembly & QA</option>
            <option value="Customer Sales & Ops">Customer Sales & Ops</option>
          </select>
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Phone Number</label>
        <input required type="text" placeholder="+233 24 000 0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={cleanInputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Base Salary (GH₵)</label>
          <input type="number" value={formData.base_salary_ghc} onChange={(e) => setFormData({ ...formData, base_salary_ghc: parseFloat(e.target.value) || 0 })} style={cleanInputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Commission/Unit (GH₵)</label>
          <input type="number" value={formData.commission_per_meter_ghc} onChange={(e) => setFormData({ ...formData, commission_per_meter_ghc: parseFloat(e.target.value) || 0 })} style={cleanInputStyle} />
        </div>
      </div>
      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        Add Employee
      </button>
    </form>
  );
}

function InventoryForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    item_name: '',
    category: 'electronic_component',
    quantity: 10,
    unit: 'pcs',
    unit_cost_ghc: 50,
    min_threshold: 5,
    location: 'Main Lab'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      quantity: parseInt(formData.quantity) || 0,
      unit_cost_ghc: parseFloat(formData.unit_cost_ghc) || 0,
      min_threshold: parseInt(formData.min_threshold) || 5,
      createdAt: serverTimestamp()
    };
    let docId = Date.now().toString();
    try {
      const docRef = await addDoc(collection(db, 'ops_inventory'), payload);
      docId = docRef.id;
    } catch (err) {
      console.warn('Firestore write inventory fallback:', err);
    }
    onSuccess({ ...payload, id: docId });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Item / Part Name</label>
        <input required type="text" placeholder="e.g. 100A STS Relays" value={formData.item_name} onChange={(e) => setFormData({ ...formData, item_name: e.target.value })} style={cleanInputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Quantity</label>
          <input required type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} style={cleanInputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Unit</label>
          <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} style={cleanInputStyle} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Unit Cost (GH₵)</label>
        <input type="number" step="0.01" value={formData.unit_cost_ghc} onChange={(e) => setFormData({ ...formData, unit_cost_ghc: parseFloat(e.target.value) })} style={cleanInputStyle} />
      </div>
      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        Save Inventory Part
      </button>
    </form>
  );
}

function ClientForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    location: '',
    ghana_post_gps: '',
    property_type: 'Compound House (3 Tenants)',
    meters_ordered: 1,
    total_amount_ghc: 1250,
    amount_paid_ghc: 0,
    status: 'New Inquiry',
    notes: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const meters = parseInt(formData.meters_ordered) || 1;
    const total = Number(formData.total_amount_ghc) || meters * 1250;
    const paid = parseFloat(formData.amount_paid_ghc) || 0;
    const orderData = {
      fullName: formData.name,
      phone: formData.phone,
      location: formData.location,
      ghanaPostGps: formData.ghana_post_gps,
      propertyType: formData.property_type,
      units: meters,
      amount: total,
      amount_paid_ghc: paid,
      balance_due_ghc: Math.max(0, total - paid),
      status: paid >= total ? 'Installed & Tested' : paid > 0 ? 'Deposit Received' : 'New Inquiry',
      notes: formData.notes || '',
      source: 'ops_manual_registration',
      createdAt: serverTimestamp(),
      clientCreatedAt: new Date().toISOString()
    };
    let docId = Date.now().toString();
    try {
      const docRef = await addDoc(collection(db, 'orders'), orderData);
      docId = docRef.id;
    } catch (err) {
      console.warn('Firestore write order fallback:', err);
    }
    const payload = {
      id: docId,
      name: formData.name,
      phone: formData.phone,
      location: formData.location,
      ghana_post_gps: formData.ghana_post_gps,
      property_type: formData.property_type,
      meters_ordered: meters,
      total_amount_ghc: total,
      amount_paid_ghc: paid,
      balance_due_ghc: Math.max(0, total - paid),
      status: paid >= total ? 'Installed & Tested' : paid > 0 ? 'Deposit Received' : 'New Inquiry',
      assigned_installer_name: 'Unassigned',
      meter_serials: 'Pending Allocation',
      notes: formData.notes,
      is_live_firestore: true,
      created_at: new Date().toISOString()
    };
    onSuccess(payload);
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Landlord / Client Name</label>
        <input required type="text" placeholder="e.g. Papa Yaw" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Phone Number</label>
        <input required type="text" placeholder="+233 24 123 4567" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Location / Landmark</label>
        <input required type="text" placeholder="e.g. East Legon near American House" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={cleanInputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Meters Ordered</label>
          <input
            type="number"
            value={formData.meters_ordered}
            onChange={(e) => {
              const qty = parseInt(e.target.value) || 1;
              setFormData({ ...formData, meters_ordered: qty, total_amount_ghc: qty * 1250 });
            }}
            style={cleanInputStyle}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Deposit Paid (GH₵)</label>
          <input
            type="number"
            value={formData.amount_paid_ghc}
            onChange={(e) => setFormData({ ...formData, amount_paid_ghc: parseFloat(e.target.value) || 0 })}
            style={cleanInputStyle}
          />
        </div>
      </div>
      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        Create Order
      </button>
    </form>
  );
}

function MilestoneForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    stage: 'Stage 01',
    title: '',
    description: '',
    progress_percent: 0,
    target_date: 'Q3 2027',
    status: 'In Progress'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      progress_percent: parseInt(formData.progress_percent) || 0,
      createdAt: serverTimestamp()
    };
    let docId = Date.now().toString();
    try {
      const docRef = await addDoc(collection(db, 'ops_milestones'), payload);
      docId = docRef.id;
    } catch (err) {
      console.warn('Firestore write milestone fallback:', err);
    }
    onSuccess({ ...payload, id: docId });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Stage / Pillar</label>
        <select value={formData.stage} onChange={(e) => setFormData({ ...formData, stage: e.target.value })} style={cleanInputStyle}>
          <option value="Stage 01">Stage 01: Unity Meters</option>
          <option value="Stage 02">Stage 02: Appliance Monitors</option>
          <option value="Stage 03">Stage 03: GridGuard Anti-Theft</option>
          <option value="Stage 04">Stage 04: Distributed Solar</option>
          <option value="Corporate">Corporate & Regulatory</option>
        </select>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Milestone Title</label>
        <input required type="text" placeholder="e.g. Deploy First 500 Unity Meters" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Description</label>
        <textarea rows={3} placeholder="Key objectives and delivery milestones..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} style={{ ...cleanInputStyle, resize: 'vertical' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Progress (%)</label>
          <input type="number" min="0" max="100" value={formData.progress_percent} onChange={(e) => setFormData({ ...formData, progress_percent: parseInt(e.target.value) || 0 })} style={cleanInputStyle} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Target Date</label>
          <input type="text" placeholder="e.g. Q2 2027" value={formData.target_date} onChange={(e) => setFormData({ ...formData, target_date: e.target.value })} style={cleanInputStyle} />
        </div>
      </div>
      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        Save Milestone
      </button>
    </form>
  );
}

function DocForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'hardware_spec',
    author: 'Engineering Team',
    summary: '',
    content: '',
    tags: 'Hardware, Spec'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      createdAt: serverTimestamp()
    };
    let docId = Date.now().toString();
    try {
      const docRef = await addDoc(collection(db, 'ops_docs'), payload);
      docId = docRef.id;
    } catch (err) {
      console.warn('Firestore write doc fallback:', err);
    }
    onSuccess({ ...payload, id: docId });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Document Title</label>
        <input required type="text" placeholder="e.g. Unity Meter 3-in-1 Hardware Schematic" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} style={cleanInputStyle} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Category</label>
          <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} style={cleanInputStyle}>
            <option value="hardware_spec">Hardware Specification</option>
            <option value="research_whitepaper">Research & Whitepaper</option>
            <option value="regulatory_compliance">Regulatory Compliance</option>
            <option value="firmware_code">Firmware & Software</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Author / Lead</label>
          <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} style={cleanInputStyle} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Executive Summary</label>
        <input type="text" placeholder="Short description of this document..." value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Full Notes / Content (Markdown supported)</label>
        <textarea rows={5} placeholder="Full technical specifications, diagrams, pinouts, or research results..." value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} style={{ ...cleanInputStyle, resize: 'vertical' }} />
      </div>
      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        Publish Document
      </button>
    </form>
  );
}

const cleanInputStyle = {
  width: '100%',
  padding: '11px 14px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '10px',
  color: '#0f172a',
  fontSize: '14px',
  outline: 'none',
  boxSizing: 'border-box'
};

const presetBtnStyle = {
  padding: '5px 12px',
  backgroundColor: '#f1f5f9',
  border: '1px solid #e2e8f0',
  borderRadius: '9999px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#334155',
  cursor: 'pointer'
};
