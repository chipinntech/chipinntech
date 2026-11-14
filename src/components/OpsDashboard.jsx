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
  Send
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState('');

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

  // Helper notification toaster
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
        throw new Error('Incorrect passcode. Try again or check your environment configuration.');
      }

      const data = await res.json();
      localStorage.setItem('chipinn_ops_token', data.token);
      setToken(data.token);
      notify('Access granted to Chipinn Ops Center');
    } catch (err) {
      // Offline fallback: if password is chipinn2026 or whatever user typed
      if (passwordInput === 'chipinn2026') {
        const dummyToken = 'offline_token_' + Date.now();
        localStorage.setItem('chipinn_ops_token', dummyToken);
        setToken(dummyToken);
        notify('Logged in (Offline / Local Mode)');
      } else {
        setAuthError(err.message || 'Authentication failed. Please verify password.');
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('chipinn_ops_token');
    setToken('');
    notify('Ops session locked');
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
      // In case backend is temporarily unreachable, maintain existing or starter view
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAllData();
    }
  }, [token]);

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
  // RENDER: PASSWORD LOCK SCREEN IF NOT AUTHENTICATED
  // ---------------------------------------------------------------------------
  if (!token) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#050811',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        color: '#f8fafc',
        fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: '#0c1220',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '40px 32px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}>
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(27, 90, 255, 0.15)', border: '1px solid rgba(27, 90, 255, 0.3)', marginBottom: '20px' }}>
            <Lock size={28} color="#3b82f6" />
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            CHIPINN OPS CENTER
          </h2>
          <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '28px', lineHeight: 1.5 }}>
            Internal business operating system. Please enter the master authorization passcode to unlock.
          </p>

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Admin Master Passcode
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  backgroundColor: '#060a12',
                  border: authError ? '1px solid #ef4444' : '1px solid #1e293b',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '15px',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {authError && (
              <div style={{ fontSize: '12px', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '6px', marginBottom: '16px', textAlign: 'left' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: '#1b5aff',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '14px',
                cursor: isAuthenticating ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 0.2s'
              }}
            >
              <Unlock size={16} />
              <span>{isAuthenticating ? 'Verifying...' : 'Unlock Ops Center'}</span>
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748b' }}>Default: <code style={{ color: '#93c5fd' }}>chipinn2026</code></span>
            <button
              onClick={onExit}
              style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Back to Public Site
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: MAIN SIDEBARED OPS CENTER DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: '#070a14',
      color: '#f8fafc',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
    }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 9999,
          backgroundColor: '#1b5aff',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.4)',
          fontSize: '13px',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* --- SIDEBAR --- */}
      <aside style={{
        width: '260px',
        backgroundColor: '#0a0f1d',
        borderRight: '1px solid #192237',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh'
      }}>
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #192237', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <img src="/assets/chipinn-logo-transparent.png" alt="Chipinn" style={{ height: '28px', width: 'auto' }} />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#ffffff' }}>OPS CENTER</div>
            <div style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 600 }}>GRIDPULSE INTERNAL</div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: '20px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <SidebarBtn
            active={activeTab === 'overview'}
            icon={<LayoutDashboard size={18} />}
            label="Overview"
            badge="Live"
            onClick={() => setActiveTab('overview')}
          />
          <SidebarBtn
            active={activeTab === 'finances'}
            icon={<Wallet size={18} />}
            label="Finances & Cash Flow"
            onClick={() => setActiveTab('finances')}
          />
          <SidebarBtn
            active={activeTab === 'employees'}
            icon={<Users size={18} />}
            label="Team & Electricians"
            count={employees.length}
            onClick={() => setActiveTab('employees')}
          />
          <SidebarBtn
            active={activeTab === 'inventory'}
            icon={<Package size={18} />}
            label="Hardware & Stock"
            alert={overview.low_stock_alerts > 0}
            onClick={() => setActiveTab('inventory')}
          />
          <SidebarBtn
            active={activeTab === 'clients'}
            icon={<Building2 size={18} />}
            label="Clients & Orders"
            count={clients.length}
            onClick={() => setActiveTab('clients')}
          />
        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '16px', borderTop: '1px solid #192237' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', padding: '8px', backgroundColor: '#0f172a', borderRadius: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
            <div style={{ fontSize: '12px', color: '#cbd5e1' }}>Admin Connected</div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onExit}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '11px',
                backgroundColor: '#1e293b',
                color: '#94a3b8',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Public Site
            </button>
            <button
              onClick={handleLogout}
              title="Lock Ops"
              style={{
                padding: '8px 12px',
                fontSize: '11px',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                color: '#ef4444',
                border: 'none',
                borderRadius: '6px',
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

      {/* --- MAIN CONTENT AREA --- */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '32px 40px', maxWidth: '1400px' }}>
        {/* Top Bar Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: '4px' }}>
              {activeTab === 'overview' && 'Executive Business Overview'}
              {activeTab === 'finances' && 'Financial Ledger & Cash Flow'}
              {activeTab === 'employees' && 'Team & Certified Electricians'}
              {activeTab === 'inventory' && 'Hardware Stock & Component Vault'}
              {activeTab === 'clients' && 'Landlord Clients & Deployment Orders'}
            </h1>
            <p style={{ fontSize: '13px', color: '#94a3b8' }}>
              Real-time operational records for Chipinn Technologies Ltd. (Ghana)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={fetchAllData}
              disabled={isLoading}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                backgroundColor: '#131b2e',
                color: '#cbd5e1',
                border: '1px solid #1e293b',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={13} className={isLoading ? 'spin' : ''} />
              <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>

            {activeTab === 'finances' && (
              <button
                onClick={() => setModalType('finance')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: '#1b5aff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} />
                <span>Record Transaction</span>
              </button>
            )}

            {activeTab === 'employees' && (
              <button
                onClick={() => setModalType('employee')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: '#1b5aff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} />
                <span>Add Team Member</span>
              </button>
            )}

            {activeTab === 'inventory' && (
              <button
                onClick={() => setModalType('inventory')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: '#1b5aff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} />
                <span>New Stock Item</span>
              </button>
            )}

            {activeTab === 'clients' && (
              <button
                onClick={() => setModalType('client')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 16px',
                  backgroundColor: '#1b5aff',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Plus size={15} />
                <span>New Client Order</span>
              </button>
            )}
          </div>
        </div>

        {/* =================================================================== */}
        {/* TAB 1: EXECUTIVE OVERVIEW */}
        {/* =================================================================== */}
        {activeTab === 'overview' && (
          <div>
            {/* Top Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
              <MetricCard
                title="Total Liquid Cash"
                value={`GH₵ ${overview.total_cash_ghc.toLocaleString()}`}
                sub={`MoMo: GH₵${overview.accounts_ghc.momo} | Bank: GH₵${overview.accounts_ghc.bank}`}
                icon={<Wallet size={20} color="#3b82f6" />}
                highlight="#3b82f6"
              />
              <MetricCard
                title="Net Operating Profit"
                value={`GH₵ ${overview.net_profit_ghc.toLocaleString()}`}
                sub={`Income: GH₵${overview.income_total_ghc} - Expenses: GH₵${overview.expense_total_ghc}`}
                icon={<TrendingUp size={20} color={overview.net_profit_ghc >= 0 ? '#22c55e' : '#ef4444'} />}
                highlight={overview.net_profit_ghc >= 0 ? '#22c55e' : '#ef4444'}
              />
              <MetricCard
                title="Unity Meters Ordered"
                value={`${overview.total_meters_ordered} Units`}
                sub="Total deployed & scheduled"
                icon={<Package size={20} color="#a855f7" />}
                highlight="#a855f7"
              />
              <MetricCard
                title="Outstanding Balances"
                value={`GH₵ ${overview.total_outstanding_ghc.toLocaleString()}`}
                sub="Receivables to collect upon install"
                icon={<Clock size={20} color="#eab308" />}
                highlight="#eab308"
              />
            </div>

            {/* Split Grid: Accounts & Activity */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '28px' }}>
              {/* Cash Accounts Box */}
              <div style={{ backgroundColor: '#0d1322', border: '1px solid #1a233a', borderRadius: '12px', padding: '24px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} color="#38bdf8" />
                  <span>Cash Accounts (Ghana)</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <AccountRow
                    name="MTN / Telecel MoMo Business Wallet"
                    type="Mobile Money Float"
                    balance={overview.accounts_ghc.momo}
                    color="#eab308"
                  />
                  <AccountRow
                    name="Corporate Bank Account"
                    type="Stanbic / Ecobank"
                    balance={overview.accounts_ghc.bank}
                    color="#3b82f6"
                  />
                  <AccountRow
                    name="Workshop Petty Cash"
                    type="Emergency site cash"
                    balance={overview.accounts_ghc.petty_cash}
                    color="#10b981"
                  />
                </div>
              </div>

              {/* Recent Activity Box */}
              <div style={{ backgroundColor: '#0d1322', border: '1px solid #1a233a', borderRadius: '12px', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="#a855f7" />
                    <span>Recent Financial Entries</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('finances')}
                    style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '12px', cursor: 'pointer' }}
                  >
                    View All →
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {overview.recent_activity.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: '#070a14',
                        border: '1px solid #151d30',
                        borderRadius: '8px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: '#f1f5f9' }}>{act.description}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {act.date} • {act.party || act.category} • <span style={{ textTransform: 'uppercase' }}>{act.account}</span>
                        </div>
                      </div>
                      <div style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: act.type === 'income' ? '#22c55e' : '#ef4444'
                      }}>
                        {act.type === 'income' ? '+' : '-'} GH₵ {act.amount_ghc}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Action Shortcuts */}
            <div style={{ backgroundColor: '#0d1322', border: '1px solid #1a233a', borderRadius: '12px', padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '2px' }}>Operational Fast Actions</h4>
                <p style={{ fontSize: '12px', color: '#64748b' }}>Quickly record entries without navigating through submenus</p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setModalType('finance')}
                  style={{ padding: '8px 14px', backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  + Log Cash In/Out
                </button>
                <button
                  onClick={() => setModalType('client')}
                  style={{ padding: '8px 14px', backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  + New Unity Meter Order
                </button>
                <button
                  onClick={() => setModalType('inventory')}
                  style={{ padding: '8px 14px', backgroundColor: '#1e293b', color: '#f8fafc', border: '1px solid #334155', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  + Stock In Components
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: FINANCES & CASH FLOW */}
        {/* =================================================================== */}
        {activeTab === 'finances' && (
          <div style={{ backgroundColor: '#0d1322', border: '1px solid #1a233a', borderRadius: '12px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => exportCSV(finances, 'chipinn-finances')}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', backgroundColor: '#151d30', color: '#cbd5e1', border: '1px solid #23304c', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                >
                  <Download size={14} />
                  <span>Export CSV</span>
                </button>
              </div>
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                Total Records: <strong>{finances.length}</strong>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e293b', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' }}>
                    <th style={{ padding: '12px' }}>Date</th>
                    <th style={{ padding: '12px' }}>Description</th>
                    <th style={{ padding: '12px' }}>Party / Client</th>
                    <th style={{ padding: '12px' }}>Category</th>
                    <th style={{ padding: '12px' }}>Account</th>
                    <th style={{ padding: '12px' }}>Reference</th>
                    <th style={{ padding: '12px', textAlign: 'right' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {finances.map((f) => (
                    <tr key={f.id} style={{ borderBottom: '1px solid #131b2e', transition: 'background-color 0.15s' }}>
                      <td style={{ padding: '12px', color: '#64748b' }}>{f.date}</td>
                      <td style={{ padding: '12px', fontWeight: 500, color: '#f1f5f9' }}>{f.description}</td>
                      <td style={{ padding: '12px', color: '#94a3b8' }}>{f.party || '—'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', backgroundColor: '#1e293b', color: '#93c5fd' }}>
                          {f.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ textTransform: 'uppercase', fontSize: '11px', fontWeight: 600, color: f.account === 'momo' ? '#eab308' : f.account === 'bank' ? '#38bdf8' : '#10b981' }}>
                          {f.account}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontFamily: 'monospace', fontSize: '11px', color: '#64748b' }}>{f.reference || '—'}</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: f.type === 'income' ? '#22c55e' : '#ef4444' }}>
                        {f.type === 'income' ? '+' : '-'} GH₵ {f.amount_ghc.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: TEAM & ELECTRICIANS */}
        {/* =================================================================== */}
        {activeTab === 'employees' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {employees.map((emp) => (
                <div key={emp.id} style={{ backgroundColor: '#0d1322', border: '1px solid #1a233a', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '2px' }}>{emp.name}</h3>
                      <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 500 }}>{emp.role}</div>
                    </div>
                    <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: emp.status === 'Active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)', color: emp.status === 'Active' ? '#22c55e' : '#94a3b8', fontWeight: 600 }}>
                      {emp.status}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#94a3b8', marginBottom: '18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={13} color="#64748b" />
                      <span>{emp.phone}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="#64748b" />
                      <span>Zone: {emp.zone || 'Unassigned'}</span>
                    </div>
                    <div>Ghana Card: <code style={{ color: '#cbd5e1' }}>{emp.ghana_card || 'Pending'}</code></div>
                  </div>

                  {/* Compensation / Commission card */}
                  <div style={{ backgroundColor: '#070a14', border: '1px solid #151d30', borderRadius: '8px', padding: '12px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                      <span style={{ color: '#64748b' }}>Meters Installed:</span>
                      <strong style={{ color: '#f8fafc' }}>{emp.meters_installed_count} units</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span style={{ color: '#64748b' }}>Earned Commission:</span>
                      <strong style={{ color: '#22c55e' }}>GH₵ {(emp.meters_installed_count * emp.commission_per_meter_ghc).toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Action row */}
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
                      style={{ flex: 1, padding: '7px', backgroundColor: '#1b5aff', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      + 1 Install Completed
                    </button>
                    <a
                      href={`https://wa.me/${emp.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ padding: '7px 12px', backgroundColor: '#1e293b', color: '#38bdf8', borderRadius: '6px', display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                    >
                      <Send size={13} />
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
                  <div key={item.id} style={{ backgroundColor: '#0d1322', border: isLow ? '1px solid #ef4444' : '1px solid #1a233a', borderRadius: '12px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ fontSize: '15px', fontWeight: 600 }}>{item.item_name}</h3>
                      {isLow && (
                        <span style={{ fontSize: '10px', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          LOW STOCK
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
                      Location: {item.location} • Unit Cost: GH₵ {item.unit_cost_ghc}
                    </div>

                    {/* Stock Counter Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', backgroundColor: '#070a14', borderRadius: '8px', marginBottom: '14px' }}>
                      <div>
                        <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase' }}>In Stock</div>
                        <div style={{ fontSize: '20px', fontWeight: 700, color: isLow ? '#ef4444' : '#f8fafc' }}>
                          {item.quantity} <span style={{ fontSize: '12px', fontWeight: 400, color: '#64748b' }}>{item.unit}</span>
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
                          style={{ width: '28px', height: '28px', backgroundColor: '#1e293b', color: '#f8fafc', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
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
                          style={{ width: '28px', height: '28px', backgroundColor: '#1b5aff', color: '#ffffff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Reorder Threshold: {item.min_threshold} {item.unit}</span>
                      <span>Total Value: GH₵ {(item.quantity * item.unit_cost_ghc).toLocaleString()}</span>
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
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {clients.map((cli) => {
              const hasBalance = cli.balance_due_ghc > 0;
              return (
                <div key={cli.id} style={{ backgroundColor: '#0d1322', border: '1px solid #1a233a', borderRadius: '12px', padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{cli.name}</h3>
                        <span style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          backgroundColor: cli.status === 'Installed & Tested' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(234, 179, 8, 0.2)',
                          color: cli.status === 'Installed & Tested' ? '#22c55e' : '#eab308',
                          fontWeight: 600
                        }}>
                          {cli.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#38bdf8', marginTop: '2px' }}>
                        {cli.property_type} • {cli.meters_ordered} Unity Meter(s)
                      </div>
                    </div>

                    {/* Financial Pill */}
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
                        GH₵ {cli.total_amount_ghc.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '11px', color: hasBalance ? '#eab308' : '#22c55e', fontWeight: 600 }}>
                        {hasBalance ? `Balance Due: GH₵ ${cli.balance_due_ghc}` : 'Paid in Full ✓'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', fontSize: '12px', color: '#94a3b8', marginBottom: '16px' }}>
                    <div>
                      <span style={{ color: '#64748b' }}>Location: </span>
                      <strong style={{ color: '#cbd5e1' }}>{cli.location}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>GhanaPost GPS: </span>
                      <code style={{ color: '#93c5fd' }}>{cli.ghana_post_gps || '—'}</code>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Assigned Installer: </span>
                      <strong style={{ color: '#cbd5e1' }}>{cli.assigned_installer_name || 'Unassigned'}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b' }}>Meter Serials: </span>
                      <code style={{ color: '#a855f7' }}>{cli.meter_serials || 'Pending Allocation'}</code>
                    </div>
                  </div>

                  {cli.notes && (
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginBottom: '14px', padding: '8px 12px', backgroundColor: '#070a14', borderRadius: '6px' }}>
                      "{cli.notes}"
                    </div>
                  )}

                  {/* Order Actions */}
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <a
                      href={`tel:${cli.phone}`}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: '#1e293b', color: '#cbd5e1', borderRadius: '6px', fontSize: '12px', textDecoration: 'none' }}
                    >
                      <Phone size={13} color="#38bdf8" />
                      <span>{cli.phone}</span>
                    </a>

                    <a
                      href={`https://wa.me/${cli.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 12px', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', borderRadius: '6px', fontSize: '12px', textDecoration: 'none', fontWeight: 600 }}
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
                        style={{ padding: '7px 14px', backgroundColor: '#1b5aff', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                      >
                        Mark Installed & Settled
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
          <OpsModalWrapper title={
            modalType === 'finance' ? 'Record Financial Transaction' :
            modalType === 'employee' ? 'Add New Team Member / Electrician' :
            modalType === 'inventory' ? 'Add Hardware Stock Item' :
            'Create Client Unity Meter Order'
          } onClose={() => setModalType(null)}>
            {modalType === 'finance' && (
              <FinanceForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Transaction saved'); }} />
            )}
            {modalType === 'employee' && (
              <EmployeeForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Team member added'); }} />
            )}
            {modalType === 'inventory' && (
              <InventoryForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Stock item created'); }} />
            )}
            {modalType === 'client' && (
              <ClientForm token={token} onSuccess={() => { setModalType(null); fetchAllData(); notify('Client order registered'); }} />
            )}
          </OpsModalWrapper>
        )}
      </main>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SUB-COMPONENTS
// ---------------------------------------------------------------------------

function SidebarBtn({ active, icon, label, badge, count, alert, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '10px 14px',
        borderRadius: '8px',
        border: 'none',
        backgroundColor: active ? '#1b5aff' : 'transparent',
        color: active ? '#ffffff' : '#94a3b8',
        fontWeight: active ? 600 : 500,
        fontSize: '13px',
        cursor: 'pointer',
        transition: 'all 0.15s ease'
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = '#11192e';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {icon}
        <span>{label}</span>
      </div>
      {badge && <span style={{ fontSize: '10px', padding: '1px 6px', backgroundColor: '#22c55e', color: '#ffffff', borderRadius: '4px', fontWeight: 700 }}>{badge}</span>}
      {count !== undefined && <span style={{ fontSize: '11px', color: active ? '#e2e8f0' : '#64748b' }}>{count}</span>}
      {alert && <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ef4444' }} />}
    </button>
  );
}

function MetricCard({ title, value, sub, icon, highlight }) {
  return (
    <div style={{
      backgroundColor: '#0d1322',
      border: '1px solid #1a233a',
      borderRadius: '12px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>{title}</span>
        <div style={{ padding: '8px', backgroundColor: '#070a14', borderRadius: '8px' }}>{icon}</div>
      </div>
      <div style={{ fontSize: '24px', fontWeight: 700, letterSpacing: '-0.02em', color: '#f8fafc', marginBottom: '6px' }}>
        {value}
      </div>
      <div style={{ fontSize: '11px', color: '#64748b' }}>{sub}</div>
    </div>
  );
}

function AccountRow({ name, type, balance, color }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 14px',
      backgroundColor: '#070a14',
      border: '1px solid #151d30',
      borderRadius: '8px'
    }}>
      <div>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#f1f5f9' }}>{name}</div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>{type}</div>
      </div>
      <div style={{ fontSize: '15px', fontWeight: 700, color }}>
        GH₵ {balance.toLocaleString()}
      </div>
    </div>
  );
}

function OpsModalWrapper({ title, onClose, children }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#0d1322',
        border: '1px solid #1e293b',
        borderRadius: '16px',
        padding: '28px',
        width: '100%',
        maxWidth: '520px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Forms
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Type</label>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'income' })}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: formData.type === 'income' ? '#22c55e' : '#1e293b', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
          >
            Income (+)
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, type: 'expense' })}
            style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', backgroundColor: formData.type === 'expense' ? '#ef4444' : '#1e293b', color: '#ffffff', fontWeight: 600, cursor: 'pointer' }}
          >
            Expense (-)
          </button>
        </div>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Amount (GH₵)</label>
        <input
          type="number"
          step="0.01"
          required
          placeholder="e.g. 1250"
          value={formData.amount_ghc}
          onChange={(e) => setFormData({ ...formData, amount_ghc: e.target.value })}
          style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Account</label>
        <select
          value={formData.account}
          onChange={(e) => setFormData({ ...formData, account: e.target.value })}
          style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
        >
          <option value="momo">MTN / Telecel MoMo Wallet</option>
          <option value="bank">Bank Account (Ecobank / Stanbic)</option>
          <option value="petty_cash">Petty Cash</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Description</label>
        <input
          type="text"
          required
          placeholder="e.g. Unity Meter payment for East Legon"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Party / Landlord / Vendor</label>
        <input
          type="text"
          placeholder="e.g. Kwesi Mensah"
          value={formData.party}
          onChange={(e) => setFormData({ ...formData, party: e.target.value })}
          style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
        />
      </div>

      <button type="submit" style={{ padding: '12px', backgroundColor: '#1b5aff', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Full Name</label>
        <input required type="text" placeholder="e.g. Kwabena Mensah" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Role</label>
        <input required type="text" placeholder="e.g. Certified Field Electrician" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Phone Number</label>
        <input required type="text" placeholder="+233 24 000 0000" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Service Zone</label>
        <input type="text" placeholder="e.g. Spintex / Tema / East Legon" value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Commission per Install (GH₵)</label>
        <input type="number" value={formData.commission_per_meter_ghc} onChange={(e) => setFormData({ ...formData, commission_per_meter_ghc: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <button type="submit" style={{ padding: '12px', backgroundColor: '#1b5aff', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
        Add Team Member
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Item Name</label>
        <input required type="text" placeholder="e.g. 100A STS Relays" value={formData.item_name} onChange={(e) => setFormData({ ...formData, item_name: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Quantity</label>
          <input required type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Unit</label>
          <input type="text" value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
        </div>
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Unit Cost (GH₵)</label>
        <input type="number" step="0.01" value={formData.unit_cost_ghc} onChange={(e) => setFormData({ ...formData, unit_cost_ghc: parseFloat(e.target.value) })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <button type="submit" style={{ padding: '12px', backgroundColor: '#1b5aff', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
        Save Inventory Item
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
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Landlord / Client Name</label>
        <input required type="text" placeholder="e.g. Papa Yaw" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Phone Number</label>
        <input required type="text" placeholder="+233 24 123 4567" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Location / Landmark</label>
        <input required type="text" placeholder="e.g. East Legon near American House" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div>
        <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>GhanaPost GPS</label>
        <input type="text" placeholder="e.g. GA-194-2819" value={formData.ghana_post_gps} onChange={(e) => setFormData({ ...formData, ghana_post_gps: e.target.value })} style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Meters Ordered</label>
          <input
            type="number"
            value={formData.meters_ordered}
            onChange={(e) => {
              const qty = parseInt(e.target.value) || 1;
              setFormData({ ...formData, meters_ordered: qty, total_amount_ghc: qty * 1250 });
            }}
            style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '11px', color: '#94a3b8', marginBottom: '4px' }}>Deposit Paid (GH₵)</label>
          <input
            type="number"
            value={formData.amount_paid_ghc}
            onChange={(e) => setFormData({ ...formData, amount_paid_ghc: parseFloat(e.target.value) || 0 })}
            style={{ width: '100%', padding: '10px', backgroundColor: '#070a14', border: '1px solid #1e293b', borderRadius: '6px', color: '#ffffff', boxSizing: 'border-box' }}
          />
        </div>
      </div>
      <button type="submit" style={{ padding: '12px', backgroundColor: '#1b5aff', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', marginTop: '10px' }}>
        Create Order
      </button>
    </form>
  );
}

