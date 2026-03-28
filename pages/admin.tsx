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
  joinEnabled?: boolean;
  updatesList?: Array<{
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
  const [joinEnabled, setJoinEnabled] = useState(false);

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
      setJoinEnabled(data.joinEnabled || false);
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
      },
      joinEnabled
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

  // Rest of the code remains the same...

  // In the Content Tab section, add this code:
  /* Content Tab */
  {activeTab === 'content' && (
    <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '32px' }}>
      {/* Existing content... */}
      
      {/* New Join Toggle */}
      <div style={{ marginTop: '20px', padding: '16px', background: '#f0f4ff', borderRadius: '8px', border: '2px solid #dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <label style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
            Enable New Member Signups
          </label>
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
            Turn on/off the ability for new members to join.
          </p>
        </div>
        <label style={{ display: 'inline-flex', alignItems: 'center', cursor: 'pointer', gap: '8px' }}>
          <input
            type="checkbox"
            checked={joinEnabled}
            onChange={(e) => setJoinEnabled(e.target.checked)}
            style={{ width: '24px', height: '24px', cursor: 'pointer' }}
          />
          <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>{joinEnabled ? 'Enabled' : 'Disabled'}</span>
        </label>
      </div>

      {/* Save button to include the join toggle */}
      <button
        onClick={handleSaveContent}
        style={{
          marginTop: '20px',
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
  )}

  // Rest of the code remains the same
}