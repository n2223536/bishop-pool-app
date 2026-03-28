import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Member {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  familySize: string;
  membershipType: string;
  signupDate: string;
  paymentStatus: 'pending' | 'paid' | 'verified';
  priorKeyfobNumber?: string;
  membershipLevel?: string;
  paymentMethod?: string;
}

interface AppData {
  pageContent: {
    generalInfo: string;
    poolInfo: string;
    updates: string;
    joiningInfo: {
      title: string;
      text: string;
      formLink: string;
    };
  };
  budget: {
    total: number;
    raised: number;
  };
  updatesList: Array<{
    id: string;
    date: string;
    title: string;
    content: string;
  }>;
  calendar: {
    enabled: boolean;
    googleCalendarId: string;
  };
}

export default function Admin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState('all');

  // Content form states
  const [generalInfo, setGeneralInfo] = useState('');
  const [poolInfo, setPoolInfo] = useState('');
  const [joiningTitle, setJoiningTitle] = useState('');
  const [joiningText, setJoiningText] = useState('');
  const [budgetTotal, setBudgetTotal] = useState(0);
  const [budgetRaised, setBudgetRaised] = useState(0);
  const [updatesList, setUpdatesList] = useState<Array<{ id: string; date: string; title: string; content: string }>>([]);
  const [newUpdateTitle, setNewUpdateTitle] = useState('');
  const [newUpdateContent, setNewUpdateContent] = useState('');
  const [activeTab, setActiveTab] = useState('members'); // 'members', 'content', 'updates'

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth') === 'true';
    if (auth) {
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const loadData = () => {
    const memberData = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(memberData);
    
    const appDataStr = localStorage.getItem('appData');
    if (appDataStr) {
      const data = JSON.parse(appDataStr);
      setAppData(data);
      setGeneralInfo(data.pageContent.generalInfo);
      setPoolInfo(data.pageContent.poolInfo);
      setJoiningTitle(data.pageContent.joiningInfo.title);
      setJoiningText(data.pageContent.joiningInfo.text);
      setBudgetTotal(data.budget.total);
      setBudgetRaised(data.budget.raised);
      setUpdatesList(data.updatesList || []);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'bishop2024') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      loadData();
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  const handleSaveContent = async () => {
    if (!appData) return;
    const updated = {
      ...appData,
      pageContent: {
        ...appData.pageContent,
        generalInfo,
        poolInfo,
        joiningInfo: {
          ...appData.pageContent.joiningInfo,
          title: joiningTitle,
          text: joiningText
        }
      },
      budget: {
        total: budgetTotal,
        raised: budgetRaised
      }
    };
    setAppData(updated);
    localStorage.setItem('appData', JSON.stringify(updated));
    
    // Save to file via API
    try {
      const response = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      if (response.ok) {
        alert('Content saved!');
      }
    } catch (error) {
      console.error('Failed to save:', error);
      alert('Saved locally, but API save failed');
    }
  };

  const handleAddUpdate = async () => {
    if (!newUpdateTitle || !newUpdateContent) {
      alert('Please fill in both title and content');
      return;
    }
    const newUpdate = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      title: newUpdateTitle,
      content: newUpdateContent
    };
    const updated = [...updatesList, newUpdate];
    setUpdatesList(updated);
    
    if (appData) {
      const newAppData = { ...appData, updatesList: updated };
      setAppData(newAppData);
      localStorage.setItem('appData', JSON.stringify(newAppData));
      
      // Save to file via API
      try {
        await fetch('/api/save-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppData)
        });
      } catch (error) {
        console.error('Failed to save:', error);
      }
    }
    
    setNewUpdateTitle('');
    setNewUpdateContent('');
    alert('Update added!');
  };

  const handleDeleteUpdate = async (id: string) => {
    const updated = updatesList.filter(u => u.id !== id);
    setUpdatesList(updated);
    
    if (appData) {
      const newAppData = { ...appData, updatesList: updated };
      setAppData(newAppData);
      localStorage.setItem('appData', JSON.stringify(newAppData));
      
      // Save to file via API
      try {
        await fetch('/api/save-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newAppData)
        });
      } catch (error) {
        console.error('Failed to save:', error);
      }
    }
  };

  const updatePaymentStatus = (id: number, status: 'pending' | 'paid' | 'verified') => {
    const updated = members.map((m) =>
      m.id === id ? { ...m, paymentStatus: status } : m
    );
    setMembers(updated);
    localStorage.setItem('members', JSON.stringify(updated));
  };

  const deleteMember = (id: number) => {
    if (confirm('Delete this member?')) {
      const updated = members.filter((m) => m.id !== id);
      setMembers(updated);
      localStorage.setItem('members', JSON.stringify(updated));
    }
  };

  const filteredMembers = members.filter((m) => {
    if (filter === 'all') return true;
    return m.paymentStatus === filter;
  });

  const stats = {
    total: members.length,
    pending: members.filter((m) => m.paymentStatus === 'pending').length,
    paid: members.filter((m) => m.paymentStatus === 'paid' || m.paymentStatus === 'verified').length,
  };

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #f0f8ff, #ffffff)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', padding: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px', textAlign: 'center' }}>Admin Access</h1>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <input
              type="password"
              placeholder="Admin Password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '16px' }}
              required
            />
            <button
              type="submit"
              style={{
                padding: '12px',
                background: '#0066cc',
                color: 'white',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Login
            </button>
          </form>
          <Link href="/" style={{ display: 'block', marginTop: '16px', textAlign: 'center', color: '#0066cc', textDecoration: 'none', fontWeight: '600' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <header style={{ background: '#0066cc', color: 'white', padding: '24px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold' }}>Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{ padding: '10px 16px', background: '#1e40af', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
          >
            Logout
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 20px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {[
            { id: 'members', label: '👥 Members' },
            { id: 'content', label: '📝 Content' },
            { id: 'updates', label: '📢 Updates' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                background: activeTab === tab.id ? '#0066cc' : '#e5e7eb',
                color: activeTab === tab.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Signups</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066cc' }}>{stats.total}</p>
              </div>
              <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Pending</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ca8a04' }}>{stats.pending}</p>
              </div>
              <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Verified</p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{stats.paid}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              {['all', 'pending', 'paid'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '6px',
                    fontWeight: '600',
                    border: 'none',
                    cursor: 'pointer',
                    background: filter === f ? '#0066cc' : '#e5e7eb',
                    color: filter === f ? 'white' : '#374151',
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f3f4f6', borderBottom: '1px solid #d1d5db' }}>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Email</th>
                    <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Status</th>
                    <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map((member) => (
                    <tr key={member.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px', color: '#1f2937', fontWeight: '600' }}>{member.firstName} {member.lastName}</td>
                      <td style={{ padding: '16px', color: '#374151' }}>{member.email}</td>
                      <td style={{ padding: '16px' }}>
                        <select
                          value={member.paymentStatus}
                          onChange={(e) => updatePaymentStatus(member.id, e.target.value as 'pending' | 'paid' | 'verified')}
                          style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="verified">Verified</option>
                        </select>
                      </td>
                      <td style={{ padding: '16px' }}>
                        <button
                          onClick={() => deleteMember(member.id)}
                          style={{ color: '#dc2626', fontWeight: '600', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Edit Page Content</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>General Information</label>
                <textarea
                  value={generalInfo}
                  onChange={(e) => setGeneralInfo(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Pool Information</label>
                <textarea
                  value={poolInfo}
                  onChange={(e) => setPoolInfo(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Joining Section Title</label>
                <input
                  type="text"
                  value={joiningTitle}
                  onChange={(e) => setJoiningTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Joining Section Text</label>
                <textarea
                  value={joiningText}
                  onChange={(e) => setJoiningText(e.target.value)}
                  rows={3}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Budget Total</label>
                  <input
                    type="number"
                    value={budgetTotal}
                    onChange={(e) => setBudgetTotal(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Budget Raised</label>
                  <input
                    type="number"
                    value={budgetRaised}
                    onChange={(e) => setBudgetRaised(Number(e.target.value))}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                  />
                </div>
              </div>
              <button
                onClick={handleSaveContent}
                style={{
                  padding: '12px 24px',
                  background: '#0066cc',
                  color: 'white',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                Save Content
              </button>
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>Manage Updates</h2>
            
            {/* Add New Update */}
            <div style={{ marginBottom: '32px', padding: '20px', background: '#f0f4ff', borderRadius: '8px', border: '2px solid #dbeafe' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea', marginBottom: '16px' }}>Add New Update</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Update Title</label>
                  <input
                    type="text"
                    value={newUpdateTitle}
                    onChange={(e) => setNewUpdateTitle(e.target.value)}
                    placeholder="e.g., Pool Renovation Started"
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>Update Content</label>
                  <textarea
                    value={newUpdateContent}
                    onChange={(e) => setNewUpdateContent(e.target.value)}
                    placeholder="Write your update here..."
                    rows={4}
                    style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                  />
                </div>
                <button
                  onClick={handleAddUpdate}
                  style={{
                    padding: '12px 24px',
                    background: '#16a34a',
                    color: 'white',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Add Update
                </button>
              </div>
            </div>

            {/* Updates List */}
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>Current Updates</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {updatesList.length > 0 ? (
                updatesList.map(update => (
                  <div key={update.id} style={{ padding: '16px', background: '#fef3f2', borderRadius: '8px', border: '1px solid #fee2e2', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: '0 0 4px 0' }}>{update.title}</h4>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 8px 0' }}>{update.date}</p>
                      <p style={{ fontSize: '14px', color: '#6b7280', margin: 0 }}>{update.content}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteUpdate(update.id)}
                      style={{ color: '#dc2626', fontWeight: '600', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}
                    >
                      Delete
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: '#9ca3af', fontSize: '14px' }}>No updates yet. Add one above!</p>
              )}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '600' }}>
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
