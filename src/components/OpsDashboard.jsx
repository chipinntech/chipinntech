import React, { useState, useEffect, useMemo } from 'react';
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
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Layers,
  Check,
  Smartphone
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

export default function OpsDashboard({ onExit }) {
  // Authentication State
  const [token, setToken] = useState(() => localStorage.getItem('chipinn_ops_token') || '');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active Tab: 'overview' | 'finances' | 'employees' | 'inventory' | 'clients'
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

  // Search & Filter State (specifically for the Log and items)
  const [searchQuery, setSearchQuery] = useState('');
  const [financeAccountFilter, setFinanceAccountFilter] = useState('all');
  const [financeTypeFilter, setFinanceTypeFilter] = useState('all');

  // Data States
  const [overview, setOverview] = useState({
    income_total_ghc: 0,
    expense_total_ghc: 0,
    net_profit_ghc: 0,
    accounts_ghc: { momo: 0, bank: 0, petty_cash: 0 },
    total_cash_ghc: 0,
    total_outstanding_ghc: 0,
    total_meters_ordered: 0,
    low_stock_alerts: 0,
    active_team_count: 0,
    recent_activity: []
  });

  const [finances, setFinances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [clients, setClients] = useState([]);

  // Modals
  const [modalType, setModalType] = useState(null); // 'finance' | 'employee' | 'inventory' | 'client'

  const notify = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // Authenticate
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError('');

    try {
      const res = await fetch(`${API_BASE}/api/ops/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordInput })
      });

      if (!res.ok) {
        throw new Error('Incorrect authorization passcode.');
      }

      const data = await res.json();
      localStorage.setItem('chipinn_ops_token', data.token);
      setToken(data.token);
      notify('Ops Console authorized successfully');
    } catch (err) {
      if (passwordInput === 'chipinn2026') {
        const dummyToken = 'offline_token_' + Date.now();
        localStorage.setItem('chipinn_ops_token', dummyToken);
        setToken(dummyToken);
        notify('Logged in (Local Mode)');
      } else {
        setAuthError(err.message || 'Passcode verification failed. Please try again.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chipinn_ops_token');
    setToken('');
    notify('Console session closed');
  };

  // Fetch all live data from FastAPI
  const fetchAllData = async () => {
    if (!token) return;
    setIsLoading(true);

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    try {
      const [resOverview, resFin, resEmp, resInv, resCli] = await Promise.all([
        fetch(`${API_BASE}/api/ops/overview`, { headers }).then(r => r.ok ? r.json() : null),
        fetch(`${API_BASE}/api/ops/finances`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/ops/employees`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/ops/inventory`, { headers }).then(r => r.ok ? r.json() : []),
        fetch(`${API_BASE}/api/ops/clients`, { headers }).then(r => r.ok ? r.json() : [])
      ]);

      if (resOverview) setOverview(resOverview);
      if (resFin) setFinances(resFin);
      if (resEmp) setEmployees(resEmp);
      if (resInv) setInventory(resInv);
      if (resCli) setClients(resCli);
    } catch {
      // Offline fallback handling
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

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
  // 1. CLEAN AWS / APPLE STYLE LOCK SCREEN
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
          <img
            src="/assets/chipinn-logo-transparent.png"
            alt="Chipinn"
            style={{ height: '36px', width: 'auto' }}
          />
          <span style={{ fontSize: '18px', color: '#cbd5e1', fontWeight: 300 }}>|</span>
          <span style={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#0f172a'
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

          <h2 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '8px' }}>
            Sign in to Ops Console
          </h2>
          <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.5, marginBottom: '32px' }}>
            Internal business management system for finances, field electricians, inventory, and orders.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '20px', textAlign: 'left' }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '8px'
              }}>
                Authorization Passcode
              </label>
              <input
                type="password"
                placeholder="Enter admin passcode"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '14px 18px',
                  backgroundColor: '#f8fafc',
                  border: authError ? '1.5px solid #ef4444' : '1.5px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#0f172a',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s, background-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => {
                  if (!authError) e.target.style.borderColor = '#0f172a';
                  e.target.style.backgroundColor = '#ffffff';
                }}
                onBlur={(e) => {
                  if (!authError) e.target.style.borderColor = '#e2e8f0';
                  e.target.style.backgroundColor = '#f8fafc';
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
                textAlign: 'left'
              }}>
                {authError}
              </div>
            )}

            {/* AWS-Style Dark Pill Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              style={{
                width: '100%',
                padding: '14px 24px',
                backgroundColor: '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '15px',
                cursor: isAuthenticating ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                boxShadow: '0 4px 14px rgba(15, 23, 42, 0.2)',
                transition: 'background-color 0.2s, transform 0.1s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
            >
              <span>{isAuthenticating ? 'Verifying...' : 'Unlock Ops Console'}</span>
              <ArrowUpRight size={18} />
            </button>
          </form>

          <div style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{ fontSize: '12px', color: '#94a3b8' }}>
              Default: <code style={{ color: '#0f172a', fontWeight: 600 }}>chipinn2026</code>
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
  // 2. MAIN ULTRA-CLEAN SIDEBARED INTERFACE (AWS STYLE)
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

      {/* --- SLEEK WHITE SIDEBAR --- */}
      <aside style={{
        width: sidebarCollapsed ? '80px' : '260px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        transition: 'width 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
        zIndex: 40
      }}>
        {/* Brand Header */}
        <div style={{
          padding: sidebarCollapsed ? '24px 16px' : '24px 20px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarCollapsed ? 'center' : 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img
              src="/assets/chipinn-logo-transparent.png"
              alt="Chipinn"
              style={{ height: '28px', width: 'auto' }}
            />
            {!sidebarCollapsed && (
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '0.04em', color: '#0f172a' }}>
                  CHIPINN
                </div>
                <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Ops Management
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <SidebarPill
            active={activeTab === 'overview'}
            collapsed={sidebarCollapsed}
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            badge="Live"
            onClick={() => setActiveTab('overview')}
          />
          <SidebarPill
            active={activeTab === 'finances'}
            collapsed={sidebarCollapsed}
            icon={<Wallet size={18} />}
            label="Finances & Cash"
            count={finances.length}
            onClick={() => setActiveTab('finances')}
          />
          <SidebarPill
            active={activeTab === 'employees'}
            collapsed={sidebarCollapsed}
            icon={<Users size={18} />}
            label="Electricians & Team"
            count={employees.length}
            onClick={() => setActiveTab('employees')}
          />
          <SidebarPill
            active={activeTab === 'inventory'}
            collapsed={sidebarCollapsed}
            icon={<Package size={18} />}
            label="Hardware Stock"
            alert={overview.low_stock_alerts > 0}
            onClick={() => setActiveTab('inventory')}
          />
          <SidebarPill
            active={activeTab === 'clients'}
            collapsed={sidebarCollapsed}
            icon={<Building2 size={18} />}
            label="Clients & Orders"
            count={clients.length}
            onClick={() => setActiveTab('clients')}
          />
        </nav>

        {/* Quick Cash Snapshot Box in Sidebar */}
        {!sidebarCollapsed && (
          <div style={{
            margin: '0 12px 16px',
            padding: '16px',
            backgroundColor: '#f8fafc',
            borderRadius: '16px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>
              MoMo Business Float
            </div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a' }}>
              GH₵ {overview.accounts_ghc.momo.toLocaleString()}
            </div>
            <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>
              ● Instant settlement
            </div>
          </div>
        )}

        {/* Footer Profile & Actions */}
        <div style={{
          padding: '16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {!sidebarCollapsed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 10px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              marginBottom: '4px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Admin Operator</span>
              </div>
              <span style={{ fontSize: '10px', color: '#94a3b8' }}>Ghana (GMT)</span>
            </div>
          )}

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
                fontWeight: 600,
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
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
        {/* AWS-STYLE FLOATING PILL TOP BAR */}
        <header style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 30
        }}>
          {/* Breadcrumb Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
            <span style={{ color: '#64748b', fontWeight: 500 }}>Chipinn Ops</span>
            <ChevronRight size={14} color="#94a3b8" />
            <span style={{ color: '#0f172a', fontWeight: 700, textTransform: 'capitalize' }}>
              {activeTab === 'overview' && 'Executive Overview'}
              {activeTab === 'finances' && 'Financial Ledger & Cash'}
              {activeTab === 'employees' && 'Field Electricians & Team'}
              {activeTab === 'inventory' && 'Hardware Stock'}
              {activeTab === 'clients' && 'Landlord Orders'}
            </span>
          </div>

          {/* Center AWS-Style Segmented Navigation Pills */}
          <div style={{
            display: 'flex',
            backgroundColor: '#f1f5f9',
            padding: '4px',
            borderRadius: '9999px',
            border: '1px solid #e2e8f0',
            gap: '2px'
          }}>
            <TopNavPill
              active={activeTab === 'overview'}
              label="Overview"
              onClick={() => setActiveTab('overview')}
            />
            <TopNavPill
              active={activeTab === 'finances'}
              label="Finances"
              badge={finances.length}
              onClick={() => setActiveTab('finances')}
            />
            <TopNavPill
              active={activeTab === 'employees'}
              label="Electricians"
              badge={employees.length}
              onClick={() => setActiveTab('employees')}
            />
            <TopNavPill
              active={activeTab === 'inventory'}
              label="Stock"
              onClick={() => setActiveTab('inventory')}
            />
            <TopNavPill
              active={activeTab === 'clients'}
              label="Orders"
              badge={clients.length}
              onClick={() => setActiveTab('clients')}
            />
          </div>

          {/* Right Header Buttons: Sync & Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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

            {/* Dark AWS-Style Action Pill Button */}
            {activeTab === 'finances' && (
              <button
                onClick={() => setModalType('finance')}
                style={primaryPillBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                <Plus size={15} />
                <span>Record Entry</span>
              </button>
            )}

            {activeTab === 'employees' && (
              <button
                onClick={() => setModalType('employee')}
                style={primaryPillBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                <Plus size={15} />
                <span>Add Electrician</span>
              </button>
            )}

            {activeTab === 'inventory' && (
              <button
                onClick={() => setModalType('inventory')}
                style={primaryPillBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                <Plus size={15} />
                <span>Add Part / Stock</span>
              </button>
            )}

            {activeTab === 'clients' && (
              <button
                onClick={() => setModalType('client')}
                style={primaryPillBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                <Plus size={15} />
                <span>New Landlord Order</span>
              </button>
            )}

            {activeTab === 'overview' && (
              <button
                onClick={() => setModalType('finance')}
                style={primaryPillBtnStyle}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e293b'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
              >
                <Plus size={15} />
                <span>Record Cash In/Out</span>
              </button>
            )}
          </div>
        </header>

        {/* CONTENT VIEWPORT */}
        <main style={{ padding: '36px 40px', maxWidth: '1440px', width: '100%', boxSizing: 'border-box' }}>
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
                    Welcome to Chipinn Ops
                  </h1>
                  <p style={{ fontSize: '14px', color: '#64748b', maxWidth: '640px', lineHeight: 1.5 }}>
                    Real-time operational command center for Unity Meter deployments (GH₵1,250), MoMo transaction settlements, electrician commissions, and inventory tracking.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setActiveTab('finances')}
                    style={{
                      padding: '12px 22px',
                      backgroundColor: '#0f172a',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
                    }}
                  >
                    View Financial Log →
                  </button>
                  <button
                    onClick={() => setActiveTab('clients')}
                    style={{
                      padding: '12px 22px',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: '1px solid #d0d5dd',
                      borderRadius: '9999px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    View Orders
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
                    {overview.recent_activity.map((act) => (
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
                          {act.type === 'income' ? '+' : '-'} GH₵ {act.amount_ghc.toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 2: FINANCIAL LOG & CASH FLOW (WHERE THE LOG IS) */}
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
                    Track all inbound customer MoMo payments, component purchases, and field electrician payouts.
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

                  <button
                    onClick={() => setModalType('finance')}
                    style={primaryPillBtnStyle}
                  >
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
                  {/* Account Segmented Pill */}
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

                  {/* Type Segmented Pill */}
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

              {/* Clean Modern Data Table (The Log) */}
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
                    {filteredFinances.map((f) => (
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
                            {f.category.replace('_', ' ')}
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
                          {f.type === 'income' ? '+' : '-'} GH₵ {f.amount_ghc.toLocaleString()}
                        </td>
                        <td style={{ padding: '16px', textAlign: 'center' }}>
                          <button
                            onClick={async () => {
                              if (window.confirm('Delete this financial entry?')) {
                                await fetch(`${API_BASE}/api/ops/finances/${f.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                });
                                notify('Entry removed');
                                fetchAllData();
                              }
                            }}
                            title="Delete entry"
                            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '4px' }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredFinances.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: '#94a3b8', fontSize: '14px' }}>
                  No matching transaction logs found.
                </div>
              )}
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 3: TEAM & ELECTRICIANS */}
          {/* =================================================================== */}
          {activeTab === 'employees' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {employees.map((emp) => (
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
                          width: '42px',
                          height: '42px',
                          borderRadius: '9999px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}>
                          {emp.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>{emp.name}</h3>
                          <div style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>{emp.role}</div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '11px',
                        padding: '3px 8px',
                        borderRadius: '9999px',
                        backgroundColor: emp.status === 'Active' ? '#ecfdf5' : '#f1f5f9',
                        color: emp.status === 'Active' ? '#059669' : '#64748b',
                        fontWeight: 600
                      }}>
                        {emp.status}
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#64748b', marginBottom: '18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Phone size={13} color="#94a3b8" />
                        <span>{emp.phone}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <MapPin size={13} color="#94a3b8" />
                        <span>{emp.zone || 'Unassigned Zone'}</span>
                      </div>
                      <div>
                        Ghana Card: <code style={{ color: '#0f172a', fontWeight: 600 }}>{emp.ghana_card || 'Pending'}</code>
                      </div>
                    </div>

                    {/* Performance & Commission Box */}
                    <div style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      border: '1px solid #f1f5f9',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#64748b' }}>Meters Installed:</span>
                        <strong style={{ color: '#0f172a' }}>{emp.meters_installed_count} units</strong>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: '#64748b' }}>Total Earned Commission:</span>
                        <strong style={{ color: '#16a34a' }}>
                          GH₵ {(emp.meters_installed_count * emp.commission_per_meter_ghc).toLocaleString()}
                        </strong>
                      </div>
                    </div>

                    {/* Action Pills */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={async () => {
                          const res = await fetch(`${API_BASE}/api/ops/employees/${emp.id}/record-install`, {
                            method: 'POST',
                            headers: { 'Authorization': `Bearer ${token}` }
                          });
                          if (res.ok) {
                            notify(`Recorded +1 installation for ${emp.name}`);
                            fetchAllData();
                          }
                        }}
                        style={{
                          flex: 1,
                          padding: '9px 14px',
                          backgroundColor: '#0f172a',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '9999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        + 1 Install Completed
                      </button>

                      <a
                        href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '9px 14px',
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 4: HARDWARE INVENTORY & STOCK */}
          {/* =================================================================== */}
          {activeTab === 'inventory' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {inventory.map((item) => {
                  const isLow = item.quantity <= item.min_threshold;
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
                        {isLow && (
                          <span style={{ fontSize: '10px', backgroundColor: '#fef2f2', color: '#b91c1c', padding: '3px 8px', borderRadius: '9999px', fontWeight: 700 }}>
                            LOW STOCK
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>
                        Location: {item.location} • Cost: GH₵ {item.unit_cost_ghc}
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
                            {item.quantity} <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>{item.unit}</span>
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={async () => {
                              await fetch(`${API_BASE}/api/ops/inventory/${item.id}/adjust`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify({ delta: -1 })
                              });
                              fetchAllData();
                            }}
                            style={{ width: '32px', height: '32px', backgroundColor: '#ffffff', border: '1px solid #d0d5dd', color: '#0f172a', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
                          >
                            -
                          </button>
                          <button
                            onClick={async () => {
                              await fetch(`${API_BASE}/api/ops/inventory/${item.id}/adjust`, {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                                body: JSON.stringify({ delta: 1 })
                              });
                              fetchAllData();
                            }}
                            style={{ width: '32px', height: '32px', backgroundColor: '#0f172a', border: 'none', color: '#ffffff', borderRadius: '9999px', cursor: 'pointer', fontWeight: 700 }}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                        <span>Alert at &le; {item.min_threshold} {item.unit}</span>
                        <span>Total Asset: GH₵ {(item.quantity * item.unit_cost_ghc).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =================================================================== */}
          {/* TAB 5: CLIENTS & ORDERS */}
          {/* =================================================================== */}
          {activeTab === 'clients' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {clients.map((cli) => {
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
                          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a' }}>{cli.name}</h3>
                          <span style={{
                            fontSize: '11px',
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            backgroundColor: cli.status === 'Installed & Tested' ? '#ecfdf5' : '#fef9c3',
                            color: cli.status === 'Installed & Tested' ? '#059669' : '#a16207',
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
                          GH₵ {cli.total_amount_ghc.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '12px', color: hasBalance ? '#ca8a04' : '#16a34a', fontWeight: 600 }}>
                          {hasBalance ? `Balance: GH₵ ${cli.balance_due_ghc}` : 'Paid in Full ✓'}
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
                        Electrician: <strong style={{ color: '#0f172a' }}>{cli.assigned_installer_name || 'Unassigned'}</strong>
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

                      {cli.status !== 'Installed & Tested' && (
                        <button
                          onClick={async () => {
                            await fetch(`${API_BASE}/api/ops/clients/${cli.id}/status`, {
                              method: 'PATCH',
                              headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                              body: JSON.stringify({ status: 'Installed & Tested', amount_paid_ghc: cli.total_amount_ghc })
                            });
                            notify(`Marked order for ${cli.name} as Installed & Tested`);
                            fetchAllData();
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
              })}
            </div>
          )}

          {/* =================================================================== */}
          {/* MODAL DIALOGS */}
          {/* =================================================================== */}
          {modalType && (
            <CleanModalWrapper
              title={
                modalType === 'finance' ? 'Record Financial Transaction' :
                modalType === 'employee' ? 'Add New Electrician / Staff' :
                modalType === 'inventory' ? 'Add Hardware Stock Part' :
                'Register Landlord Order'
              }
              onClose={() => setModalType(null)}
            >
              {modalType === 'finance' && (
                <FinanceForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Entry recorded'); }} />
              )}
              {modalType === 'employee' && (
                <EmployeeForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Electrician added'); }} />
              )}
              {modalType === 'inventory' && (
                <InventoryForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Stock item saved'); }} />
              )}
              {modalType === 'client' && (
                <ClientForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Order registered'); }} />
              )}
            </CleanModalWrapper>
          )}
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// AWS-STYLE PILL BUTTONS & SUB-COMPONENTS
// ---------------------------------------------------------------------------

const primaryPillBtnStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '10px 22px',
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

function TopNavPill({ active, label, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '7px 16px',
        borderRadius: '9999px',
        border: 'none',
        backgroundColor: active ? '#ffffff' : 'transparent',
        color: active ? '#0f172a' : '#64748b',
        fontWeight: active ? 700 : 500,
        fontSize: '13px',
        cursor: 'pointer',
        boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 0.15s ease'
      }}
    >
      <span>{label}</span>
      {badge !== undefined && (
        <span style={{
          fontSize: '10px',
          padding: '2px 6px',
          borderRadius: '9999px',
          backgroundColor: active ? '#0f172a' : '#e2e8f0',
          color: active ? '#ffffff' : '#475467',
          fontWeight: 700
        }}>
          {badge}
        </span>
      )}
    </button>
  );
}

function SidebarPill({ active, collapsed, icon, label, badge, count, alert, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        width: '100%',
        padding: '11px 14px',
        borderRadius: '9999px',
        border: 'none',
        backgroundColor: active ? '#0f172a' : 'transparent',
        color: active ? '#ffffff' : '#475467',
        fontWeight: active ? 600 : 500,
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
        {!collapsed && <span>{label}</span>}
      </div>
      {!collapsed && badge && (
        <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '9999px', fontWeight: 700 }}>
          {badge}
        </span>
      )}
      {!collapsed && count !== undefined && (
        <span style={{ fontSize: '11px', color: active ? '#94a3b8' : '#94a3b8' }}>
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
        maxWidth: '520px',
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/ops/finances`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...formData, amount_ghc: parseFloat(formData.amount_ghc) })
    });
    if (res.ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          <option value="momo">MTN / Telecel MoMo Wallet</option>
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

      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        Save Transaction
      </button>
    </form>
  );
}

function EmployeeForm({ token, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Field Electrician',
    phone: '',
    momo_number: '',
    ghana_card: '',
    zone: 'Accra Central',
    commission_per_meter_ghc: 120
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_BASE}/api/ops/employees`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Full Name</label>
        <input required type="text" placeholder="e.g. Kwabena Mensah" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Role</label>
        <input required type="text" placeholder="e.g. Certified Field Electrician" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Phone Number</label>
        <input required type="text" placeholder="+233 24 000 0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Service Zone</label>
        <input type="text" placeholder="e.g. Spintex / Tema / East Legon" value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} style={cleanInputStyle} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>Commission per Install (GH₵)</label>
        <input type="number" value={formData.commission_per_meter_ghc} onChange={(e) => setFormData({ ...formData, commission_per_meter_ghc: parseFloat(e.target.value) })} style={cleanInputStyle} />
      </div>
      <button type="submit" style={{ ...primaryPillBtnStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}>
        Add Electrician / Staff
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
    const res = await fetch(`${API_BASE}/api/ops/inventory`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) onSuccess();
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
    const res = await fetch(`${API_BASE}/api/ops/clients`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) onSuccess();
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
      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>GhanaPost GPS</label>
        <input type="text" placeholder="e.g. GA-194-2819" value={formData.ghana_post_gps} onChange={(e) => setFormData({ ...formData, ghana_post_gps: e.target.value })} style={cleanInputStyle} />
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
