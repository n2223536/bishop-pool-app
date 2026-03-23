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
}

export default function Admin() {
  const [members, setMembers] = useState<Member[]>([]);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth') === 'true';
    if (auth) {
      setIsAuthenticated(true);
      loadMembers();
    }
  }, []);

  const loadMembers = () => {
    const data = JSON.parse(localStorage.getItem('members') || '[]');
    setMembers(data);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'bishop2024') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      loadMembers();
    } else {
      alert('Invalid password');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
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
            ← Back to Signup
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
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '32px' }}>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Total Signups</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#0066cc' }}>{stats.total}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Pending Payment</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ca8a04' }}>{stats.pending}</p>
          </div>
          <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '24px' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Payment Verified</p>
            <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#16a34a' }}>{stats.paid}</p>
          </div>
        </div>

        {/* Filters */}
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

        {/* Table */}
        <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f3f4f6', borderBottom: '1px solid #d1d5db' }}>
              <tr>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Name</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Email</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Phone</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Membership</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '16px', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} style={{ borderBottom: '1px solid #e5e7eb', background: 'white' }}>
                  <td style={{ padding: '16px', color: '#1f2937', fontWeight: '600' }}>
                    {member.firstName} {member.lastName}
                  </td>
                  <td style={{ padding: '16px', color: '#374151' }}>{member.email}</td>
                  <td style={{ padding: '16px', color: '#374151' }}>{member.phone}</td>
                  <td style={{ padding: '16px', color: '#374151' }}>{member.membershipType}</td>
                  <td style={{ padding: '16px' }}>
                    <select
                      value={member.paymentStatus}
                      onChange={(e) => updatePaymentStatus(member.id, e.target.value)}
                      style={{ padding: '6px 12px', border: '1px solid #d1d5db', borderRadius: '4px', fontSize: '14px' }}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="paid">💰 Paid</option>
                      <option value="verified">✅ Verified</option>
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
          {filteredMembers.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
              No members found
            </div>
          )}
        </div>

        {/* Back Link */}
        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <Link href="/" style={{ color: '#0066cc', textDecoration: 'none', fontWeight: '600' }}>
            ← Back to Signup
          </Link>
        </div>
      </main>
    </div>
  );
}
