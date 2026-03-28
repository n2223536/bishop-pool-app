import { useState, useEffect } from 'react';
import Link from 'next/link';
import Head from 'next/head';

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

  // Check if favicon exists
  const [faviconExists, setFaviconExists] = useState(false);

  useEffect(() => {
    // Check if favicon exists
    fetch('/favicon.ico')
      .then(response => {
        if (response.ok) {
          setFaviconExists(true);
        }
      })
      .catch(() => {
        console.warn('Favicon not found');
      });
  }, []);
  
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
            joinEnabled: false,
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

  const poolImages = ['pool-bishop-estates.jpg', 'pool-family.jpg', 'pool-splash.jpg', 'pool-people.jpg', 'pool-outside.jpg'];

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
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        {!faviconExists && <meta name="description" content="Favicon check failed" />}
      </Head>
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

        {/* Rest of the existing code remains unchanged... */}
        
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

        {/* Rest of the existing code remains unchanged... */}
      </div>
    </>
  );
}