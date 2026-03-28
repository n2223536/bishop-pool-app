import { useState, useEffect } from 'react';
import Link from 'next/link';

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
  calendar: {
    enabled: boolean;
    googleCalendarId: string;
  };
  updatesList?: Array<{
    id: string;
    date: string;
    title: string;
    content: string;
  }>;
}

export default function Home() {
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [activeTab, setActiveTab] = useState('pool'); // 'pool', 'join', 'updates'
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const poolImages = ['pool-bishop-estates.jpg', 'pool-family.jpg', 'pool-splash.jpg', 'pool-people.jpg', 'pool-outside.jpg'];
  
  // Load app data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/data');
        const data = await response.json();
        setAppData(data);
        localStorage.setItem('appData', JSON.stringify(data));
      } catch (error) {
        console.error('Failed to load app data:', error);
        const stored = localStorage.getItem('appData');
        if (stored) {
          setAppData(JSON.parse(stored));
        } else {
          setAppData({
            pageContent: {
              generalInfo: 'Welcome to the Bishop Estates Cabana Club!',
              poolInfo: 'Our beautiful pool is open daily from 9 AM to 8 PM.',
              updates: 'Pool renovations starting soon!',
              joiningInfo: {
                title: 'Become a Member',
                text: 'Join our vibrant community!',
                formLink: '/join'
              }
            },
            budget: {
              total: 200000,
              raised: 20000
            },
            updatesList: [],
            calendar: {
              enabled: false,
              googleCalendarId: ''
            }
          });
        }
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % poolImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const bgStyle = {
    minHeight: '100vh',
    backgroundImage: `linear-gradient(135deg, rgba(0,102,204,0.7) 0%, rgba(0,204,255,0.7) 50%, rgba(102,255,204,0.7) 100%), url('/${poolImages[bgImageIndex]}')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    position: 'relative' as const,
    overflow: 'hidden',
    transition: 'background-image 0.8s ease-in-out'
  };

  return (
    <div style={bgStyle}>
      {/* Background image carousel indicator */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        display: 'flex',
        gap: '8px',
        zIndex: 10
      }}>
        {poolImages.map((_, idx) => (
          <div key={idx} style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: idx === bgImageIndex ? '#fff' : 'rgba(255,255,255,0.4)',
            transition: 'all 0.3s ease'
          }} />
        ))}
      </div>

      {/* Water wave decorations */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1200 120%22 preserveAspectRatio=%22none%22%3E%3Cpath d=%22M0,40 Q300,0 600,40 T1200,40 L1200,120 L0,120 Z%22 fill=%22rgba(255,255,255,0.08)%22/%3E%3Cpath d=%22M0,60 Q300,20 600,60 T1200,60 L1200,120 L0,120 Z%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat-x',
        backgroundPosition: '0 0, 0 20px',
        backgroundSize: '600px 80px',
        pointerEvents: 'none',
        zIndex: 1
      }}/>

      {/* Photo Carousel Hero */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '400px',
        zIndex: 2,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <img 
          src={`/${poolImages[bgImageIndex]}`}
          alt="Bishop Estates Pool"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            transition: 'opacity 0.8s ease-in-out',
            display: 'block'
          }}
        />
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏊‍♂️</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '12px', textShadow: '2px 2px 8px rgba(0,0,0,0.5)' }}>Bishop Estates Cabana Club</h1>
          <p style={{ fontSize: '20px', textShadow: '1px 1px 4px rgba(0,0,0,0.5)' }}>Join the Barracudas Family! 🐠</p>
        </div>
      </div>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.95) 0%, rgba(0, 204, 255, 0.95) 100%)', color: 'white', padding: '60px 20px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', marginBottom: '12px', textShadow: '2px 2px 8px rgba(0,0,0,0.3)', letterSpacing: '0.5px' }}>
            ✨ Where Memories Are Made ✨
          </p>
          <p style={{ fontSize: '18px', color: '#e0e7ff', fontStyle: 'italic' }}>
            One splash at a time 💦
          </p>
        </div>
      </header>

      {/* Main Content Container */}
      {appData && (
        <div style={{ position: 'relative', zIndex: 2, margin: '20px auto', maxWidth: '1200px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          
          {/* Left: Calendar + Budget */}
          <div>
              <div style={{ padding: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px', overflow: 'hidden' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea', marginBottom: '16px', textAlign: 'center' }}>📅 Club Events</h3>
                <div style={{ position: 'relative', width: '100%', paddingBottom: '75%', height: '0', overflow: 'hidden', maxWidth: '100%' }}>
                  <iframe 
                    src="https://calendar.google.com/calendar/embed?src=bishopestatescabanaclub%40gmail.com&ctz=America%2FLos_Angeles" 
                    style={{ 
                      position: 'absolute', 
                      top: '0', 
                      left: '0', 
                      width: '100%', 
                      height: '100%', 
                      border: '0' 
                    }} 
                    allowFullScreen={true} 
                    sandbox="allow-scripts allow-same-origin allow-popups"
                    title="Bishop Estates Cabana Club Calendar">
                  </iframe>
                </div>
              </div>

            {/* Budget Progress */}
            <div style={{ padding: '24px', background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f1ff 100%)', borderRadius: '12px', border: '2px solid #dbeafe', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#667eea', marginBottom: '16px' }}>💰 Renovation Budget</h3>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px', background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', borderRadius: '12px', border: '2px dashed #2563eb', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}>
                <h4 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '12px', textShadow: '1px 1px 2px rgba(255,255,255,0.7)' }}>
                  Help Us Make a Splash! 🌊
                </h4>
                
                {/* Pool Transformation Meter */}
                <div style={{ width: '90%', maxWidth: '600px', height: '60px', background: 'rgba(255,255,255,0.3)', borderRadius: '30px', border: '2px solid rgba(255,255,255,0.6)', position: 'relative', margin: '10px auto 20px auto', overflow: 'hidden' }}>
                  {/* Water Level */}
                  <div style={{ 
                    width: `${Math.min(100, (appData.budget.raised / appData.budget.total) * 100)}%`, 
                    height: '100%', 
                    background: 'linear-gradient(180deg, rgba(79, 172, 254, 0.8) 0%, rgba(40, 118, 251, 0.8) 100%)', 
                    position: 'absolute', 
                    bottom: 0, 
                    left: 0, 
                    transition: 'width 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)', // Fun, bouncy transition
                    borderRadius: '30px 30px 0 0' // Rounded on top only
                  }}></div>
                  {/* Milestone Markers (approximate placement) */}
                  <span style={{ position: 'absolute', bottom: '70%', left: '25%', fontSize: '11px', color: 'white', fontWeight: '600', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>Resurf.</span>
                  <span style={{ position: 'absolute', bottom: '70%', left: '50%', fontSize: '11px', color: 'white', fontWeight: '600', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>Pumps</span>
                  <span style={{ position: 'absolute', bottom: '70%', left: '75%', fontSize: '11px', color: 'white', fontWeight: '600', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>Filters</span>
                  <span style={{ position: 'absolute', bottom: '70%', left: '95%', fontSize: '11px', color: 'white', fontWeight: '600', textShadow: '1px 1px 1px rgba(0,0,0,0.5)' }}>{appData.budget.raised >= appData.budget.total ? 'DONE!' : 'Extras'}</span>
                </div>

                <p style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', margin: '0 0 10px 0' }}>
                  Donated: ${appData.budget.raised.toLocaleString()} / Goal: ${appData.budget.total.toLocaleString()}
                </p>
                
                <p style={{ fontSize: '11px', color: '#1e3a8a', fontWeight: 'bold' }}>
                  {((appData.budget.raised / appData.budget.total) * 100).toFixed(1)}% Funded - Every drop counts! 💧
                </p>

                <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <img 
                    src="/venmo-qr.png" 
                    alt="Venmo QR Code for Donations" 
                    style={{ 
                      width: '250px', 
                      height: '250px', 
                      maxWidth: '100%', 
                      objectFit: 'contain', 
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }} 
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // Prevent infinite loop
                      target.style.display = 'none';
                      if (target.parentElement && target.parentElement.nextSibling) {
                        const errorMessage = document.createElement('p');
                        errorMessage.style.color = '#9ca3af';
                        errorMessage.style.fontSize = '11px';
                        errorMessage.textContent = 'Add venmo-qr.png to /public/';
                        target.parentElement.replaceChild(errorMessage, errorMessage);
                      }
                    }}
                  />
                  <p style={{ fontSize: '11px', color: '#1e3a8a', marginTop: '10px', fontWeight: '600' }}>Scan to Donate!</p>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: '600', marginBottom: '8px' }}>${appData.budget.raised.toLocaleString()} of ${appData.budget.total.toLocaleString()}</p>
              <div style={{ width: '100%', height: '28px', background: '#e5e7eb', borderRadius: '12px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    width: `${Math.min(100, (appData.budget.raised / appData.budget.total) * 100)}%`,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                    transition: 'width 0.3s ease'
                  }} 
                />
              </div>
              <p style={{ fontSize: '14px', color: '#667eea', fontWeight: '600', marginTop: '8px' }}>{((appData.budget.raised / appData.budget.total) * 100).toFixed(1)}% Complete</p>
            </div>
          </div>

          {/* Right: Tabs + Content */}
          <div>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              {[
                { id: 'pool', label: '🏊 Pool Info' },
                { id: 'updates', label: '📢 Updates' },
                ...(appData && appData.joinEnabled ? [{ id: 'join', label: '🎉 Join' }] : [])
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    background: activeTab === tab.id ? '#667eea' : '#e5e7eb',
                    color: activeTab === tab.id ? 'white' : '#374151',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', minHeight: '400px' }}>
              
              {/* Pool Info Tab */}
              {activeTab === 'pool' && (
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#667eea', marginBottom: '12px' }}>Pool Information</h3>
                  <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{appData.pageContent.poolInfo}</p>
                  <div style={{ padding: '16px', background: '#f0f4ff', borderRadius: '8px', border: '1px solid #dbeafe' }}>
                    <p style={{ fontSize: '14px', color: '#667eea', fontWeight: '600', margin: '0' }}>ℹ️ {appData.pageContent.generalInfo}</p>
                  </div>
                </div>
              )}

              {/* Updates Tab */}
              {activeTab === 'updates' && (
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#667eea', marginBottom: '16px' }}>Recent Updates</h3>
                  {appData.updatesList && appData.updatesList.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {appData.updatesList.map(update => (
                        <div key={update.id} style={{ padding: '16px', background: '#fef3f2', borderRadius: '8px', border: '1px solid #fee2e2' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                            <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#374151', margin: 0 }}>{update.title}</h4>
                            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>{update.date}</span>
                          </div>
                          <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', margin: 0 }}>{update.content}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#9ca3af', fontSize: '14px' }}>No updates yet. Check back soon!</p>
                  )}
                </div>
              )}

              {/* Join Tab */}
              {activeTab === 'join' && (
                <div>
                  <h3 style={{ fontSize: '22px', fontWeight: 'bold', color: '#764ba2', marginBottom: '12px' }}>{appData.pageContent.joiningInfo.title}</h3>
                  <p style={{ fontSize: '16px', color: '#374151', lineHeight: '1.6', marginBottom: '16px' }}>{appData.pageContent.joiningInfo.text}</p>
                  <Link href="/join" style={{ display: 'inline-block', padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
                    Sign Up Now →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Admin Link */}
      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', marginTop: '40px', marginBottom: '40px' }}>
        <Link href="/admin" style={{ color: 'white', textDecoration: 'none', fontWeight: '600', padding: '10px 20px', background: 'rgba(0,0,0,0.3)', borderRadius: '6px' }}>
          👤 Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
