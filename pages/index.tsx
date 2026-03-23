import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [bgImageIndex, setBgImageIndex] = useState(0);
  const poolImages = ['pool-family.jpg', 'pool-splash.jpg', 'pool-people.jpg', 'pool-outside.jpg'];
  
  // Rotate background image every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setBgImageIndex((prev) => (prev + 1) % poolImages.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const [showTerms, setShowTerms] = useState(false);
  const [hasReadTerms, setHasReadTerms] = useState(false);
  const [showGuestPolicy, setShowGuestPolicy] = useState(false);
  const [showPartyPolicy, setShowPartyPolicy] = useState(false);
  const [showSitterPolicy, setShowSitterPolicy] = useState(false);
  const [hasSitters, setHasSitters] = useState(false);
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const canvasRefs = {};
  
  const [formData, setFormData] = useState({
    familyName: '',
    priorKeyfobNumber: '',
    address: { street: '', city: '', state: 'CA', zip: '' },
    phone: '',
    email: '',
    altEmail: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    adults: [{ name: '' }, { name: '' }, { name: '' }, { name: '' }],
    children: [
      { name: '', month: '', day: '', year: '' },
      { name: '', month: '', day: '', year: '' },
      { name: '', month: '', day: '', year: '' },
      { name: '', month: '', day: '', year: '' },
    ],
    additionalChildren: '',
    sitters: [{ name: '' }, { name: '' }],
    needsKeyfob: false,
    acceptKeyfobFee: false,
    acceptSitterPolicy: false,
    acceptMembershipRules: false,
    acceptGuestPolicy: false,
    acceptPartyPolicy: false,
    acceptTerms: false,
    adultSignatures: [
      { name: '', date: '' },
      { name: '', date: '' },
      { name: '', date: '' },
      { name: '', date: '' },
    ],
    minorMemberNames: '',
    parentGuardianName: '',
    parentGuardianSignature: '',
    minorSignatureDate: '',
    membershipLevel: 'family',
    paymentMethod: 'card',
    referral: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNestedChange = (section, index, field, value) => {
    setFormData((prev) => {
      const updated = { ...prev };
      updated[section][index][field] = value;
      return updated;
    });
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasReadTerms || !formData.acceptTerms) {
      alert('You must read and accept the terms');
      return;
    }

    const members = JSON.parse(localStorage.getItem('members') || '[]');
    const newMember = {
      id: Date.now(),
      ...formData,
      signupDate: new Date().toISOString(),
      paymentStatus: 'pending',
    };
    members.push(newMember);
    localStorage.setItem('members', JSON.stringify(members));
    setSubmitted(true);
    setTimeout(() => window.location.reload(), 2000);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, rgba(0,102,204,0.7) 0%, rgba(0,204,255,0.7) 50%, rgba(102,255,204,0.7) 100%), url('//${poolImages[bgImageIndex]}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative', 
      overflow: 'hidden',
      transition: 'background 1s ease-in-out'
    }}>
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
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 15% 30%, rgba(255,255,255,0.2) 0%, transparent 40%), radial-gradient(circle at 85% 70%, rgba(255,255,255,0.15) 0%, transparent 35%)',
        pointerEvents: 'none',
        zIndex: 0
      }}/>
      {/* Header with Hero */}
      <header style={{ background: 'linear-gradient(135deg, rgba(0, 102, 204, 0.95) 0%, rgba(0, 204, 255, 0.95) 100%)', color: 'white', padding: '60px 20px', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', position: 'relative', zIndex: 2 }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ fontSize: '72px', marginBottom: '16px' }}>🏊‍♂️</div>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '12px' }}>Bishop Estates Cabana Club</h1>
          <p style={{ fontSize: '20px', color: '#e0e7ff', marginBottom: '8px' }}>Join the Barracudas Family! 🐠</p>
          <p style={{ fontSize: '14px', color: '#c7d2fe' }}>Where memories are made, one splash at a time</p>
        </div>
      </header>

      {/* Policies Modals */}
      {showSitterPolicy && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>Sitter/Caregiver Policy</h2>
            <div style={{ color: '#374151', lineHeight: '1.7', fontSize: '13px', marginBottom: '20px' }}>
              <p style={{ marginBottom: '16px' }}><strong>Definition:</strong> Sitters or caregivers are adults who routinely care for minor children who live in the membership household.</p>
              <p style={{ marginBottom: '12px', fontWeight: '600' }}>REQUIREMENTS</p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Each sitter/caregiver must sign a liability waiver</li>
                <li>Sitters/caregivers may only be present when caring for member children</li>
                <li>Sitters/caregivers may NOT be present if adult members are present</li>
                <li>All sitter/caregiver names must be listed on membership</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setShowSitterPolicy(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showGuestPolicy && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>Guest Policy</h2>
            <div style={{ color: '#374151', lineHeight: '1.7', fontSize: '13px', marginBottom: '20px' }}>
              <p style={{ marginBottom: '16px', fontWeight: '600' }}>PURPOSE</p>
              <p style={{ marginBottom: '16px' }}>Guidance for non-member guests at Bishop Estates Cabana Club.</p>
              <p style={{ marginBottom: '12px', fontWeight: '600' }}>FEE & EXPIRATION</p>
              <p style={{ marginBottom: '16px' }}>Every member household receives 10 guest passes per year at no charge. Additional passes: $3.00 each.</p>
              <p style={{ marginBottom: '12px', fontWeight: '600' }}>LIMITATIONS</p>
              <p style={{ marginBottom: '16px' }}>Up to 9 guests at any one time. More than 9 guests requires Party Policy rules.</p>
              <p style={{ marginBottom: '12px', fontWeight: '600' }}>RESPONSIBILITIES</p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>All guests subject to Club policies</li>
                <li>Members responsible for guest conduct</li>
                <li>Members may not leave guests unattended</li>
                <li>All guests must be accompanied by adult member</li>
                <li>Each guest must sign waiver before entering</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setShowGuestPolicy(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showPartyPolicy && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>Party Policy</h2>
            <div style={{ color: '#374151', lineHeight: '1.7', fontSize: '13px', marginBottom: '20px' }}>
              <p style={{ marginBottom: '16px' }}>Reserve the covered area or grass area to host parties for birthdays, BBQs, baby showers, etc.</p>
              <p style={{ marginBottom: '12px', fontWeight: '600' }}>FEES & DEPOSITS</p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Party Fee: $225</li>
                <li>Refundable Cleaning Deposit: $50</li>
                <li>Extra Lifeguard: $20-25/hour (1 per 10 swimmers; 1st included)</li>
                <li>Extra Guests: $10 each (if approved beyond 25)</li>
              </ul>
              <p style={{ marginBottom: '12px', fontWeight: '600' }}>GUIDELINES</p>
              <ul style={{ marginLeft: '20px', marginBottom: '16px' }}>
                <li>Max 3 hours (unless approved)</li>
                <li>Max 25 guests (unless approved)</li>
                <li>Follow city noise ordinances</li>
                <li>NO alcohol or drugs</li>
                <li>All guests must sign waiver</li>
              </ul>
            </div>
            <button
              type="button"
              onClick={() => setShowPartyPolicy(false)}
              style={{
                width: '100%',
                padding: '12px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showTerms && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'white', borderRadius: '12px', maxWidth: '700px', maxHeight: '80vh', overflow: 'auto', padding: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', marginBottom: '20px' }}>Membership Liability Waiver & Release</h2>
            <div style={{ color: '#374151', lineHeight: '1.7', fontSize: '13px', marginBottom: '20px', maxHeight: '60vh', overflowY: 'auto' }}>
              <p style={{ marginBottom: '16px', fontWeight: '600' }}>As a member of Bishop Estates Cabana Club located at 1812 Jefferson Street, Concord, CA 94521, I acknowledge and agree that my membership is conditioned upon my acceptance of all terms, conditions and agreements.</p>

              <h4 style={{ fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>1. Assumption of Risks</h4>
              <p style={{ marginBottom: '12px' }}>I acknowledge that swimming is an inherently dangerous activity. There is NO LIFEGUARD on duty at most times. I am physically and mentally fit for swimming and agree not to swim under the influence of alcohol or drugs. I assume ALL RISKS of bodily injury or death.</p>

              <h4 style={{ fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>2. Waive All Claims</h4>
              <p style={{ marginBottom: '12px' }}>I RELEASE, WAIVE, DISCHARGE AND COVENANT NOT TO SUE the Club from any and all liability for injury, death, or property damage.</p>

              <h4 style={{ fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>3. Hold Harmless</h4>
              <p style={{ marginBottom: '12px' }}>I agree to DEFEND, INDEMNIFY AND HOLD HARMLESS the Club against all losses, claims, demands, and damages.</p>

              <h4 style={{ fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>4. Rules & Conduct</h4>
              <p style={{ marginBottom: '12px' }}>I agree to follow all Club rules. Key rules: no running on deck, no diving in shallow areas, children under 12 must be supervised, no glass, no alcohol/drugs, respect swim team times.</p>

              <h4 style={{ fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>5. Medical Authorization</h4>
              <p style={{ marginBottom: '12px' }}>In the event of injury, I authorize the Club to make medical care decisions.</p>

              <h4 style={{ fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>6. Minors</h4>
              <p style={{ marginBottom: '12px' }}>I represent that I am the parent/legal guardian with authority to agree to these terms on behalf of all minors in my household.</p>

              <h4 style={{ fontWeight: '600', marginTop: '16px', marginBottom: '8px' }}>7. COVID-19 Release</h4>
              <p style={{ marginBottom: '12px' }}>I assume full responsibility for any risk of exposure to or contraction of COVID-19.</p>

              <p style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                I HAVE READ THIS WAIVER IN FULL, UNDERSTAND ITS TERMS, AND HAVE SIGNED FREELY AND VOLUNTARILY.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setHasReadTerms(true);
                setShowTerms(false);
              }}
              style={{
                width: '100%',
                padding: '12px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px',
              }}
            >
              I Have Read & Understand
            </button>
          </div>
        </div>
      )}

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 20px', position: 'relative', zIndex: 2 }}>
        <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
          {/* Progress Bar */}
          <div style={{ height: '4px', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }} />

          <div style={{ padding: '48px' }}>
            {submitted && (
              <div style={{ marginBottom: '24px', padding: '20px', background: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)', border: '2px solid #4ade80', borderRadius: '12px', color: '#166534', fontWeight: '600', fontSize: '16px', textAlign: 'center' }}>
                ✅ Registration submitted! Check your email for confirmation.
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              {/* Contact Info */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>📋</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Contact Information</h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <input
                    type="text"
                    name="familyName"
                    placeholder="Family Name *"
                    value={formData.familyName}
                    onChange={handleInputChange}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1', transition: 'border-color 0.2s' }}
                    required
                  />
                  <input
                    type="text"
                    name="priorKeyfobNumber"
                    placeholder="Prior Member Key Fob # (optional)"
                    value={formData.priorKeyfobNumber}
                    onChange={handleInputChange}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                  />
                  <input
                    type="text"
                    placeholder="Street Address *"
                    value={formData.address.street}
                    onChange={(e) => handleAddressChange('street', e.target.value)}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                    required
                  />
                  <input
                    type="text"
                    placeholder="City *"
                    value={formData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                    required
                  />
                  <select
                    value={formData.address.state}
                    onChange={(e) => handleAddressChange('state', e.target.value)}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                  >
                    <option>CA</option>
                    <option>Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Zip Code *"
                    value={formData.address.zip}
                    onChange={(e) => handleAddressChange('zip', e.target.value)}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                    required
                  />
                  <input
                    type="email"
                    name="altEmail"
                    placeholder="Alternative Email (optional)"
                    value={formData.altEmail}
                    onChange={handleInputChange}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                  />
                  <input
                    type="text"
                    name="emergencyContactName"
                    placeholder="Emergency Contact Name *"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                    required
                  />
                  <input
                    type="tel"
                    name="emergencyContactPhone"
                    placeholder="Emergency Contact Phone *"
                    value={formData.emergencyContactPhone}
                    onChange={handleInputChange}
                    style={{ padding: '14px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                    required
                  />
                </div>
              </section>

              {/* Adults */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>👨‍👩‍👧</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Family Members</h3>
                </div>
                
                <div style={{ marginBottom: '20px', padding: '16px', background: '#f0f4ff', borderRadius: '8px', border: '2px solid #dbeafe' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    How many adults in your household?
                  </label>
                  <select
                    value={numAdults}
                    onChange={(e) => setNumAdults(parseInt(e.target.value))}
                    style={{ padding: '12px', border: '2px solid #dbeafe', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                  >
                    {[1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} adult{num > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                  {Array.from({ length: numAdults }).map((_, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Adult #${index + 1} Name *`}
                      value={formData.adults[index]?.name || ''}
                      onChange={(e) => handleNestedChange('adults', index, 'name', e.target.value)}
                      style={{ padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                      required
                    />
                  ))}
                </div>

                <div style={{ marginBottom: '20px', padding: '16px', background: '#fef3f2', borderRadius: '8px', border: '2px solid #fee2e2' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    How many children under 18?
                  </label>
                  <select
                    value={numChildren}
                    onChange={(e) => setNumChildren(parseInt(e.target.value))}
                    style={{ padding: '12px', border: '2px solid #fee2e2', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                  >
                    {[0, 1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num === 0 ? 'None' : `${num} child${num > 1 ? 'ren' : ''}`}
                      </option>
                    ))}
                  </select>
                </div>

                {numChildren > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {Array.from({ length: numChildren }).map((_, index) => (
                      <div key={index} style={{ padding: '16px', background: 'linear-gradient(135deg, #fef3f2 0%, #fef5f1 100%)', border: '2px solid #fee2e2', borderRadius: '8px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '12px', alignItems: 'end' }}>
                        <input
                          type="text"
                          placeholder={`Child #${index + 1} Name *`}
                          value={formData.children[index]?.name || ''}
                          onChange={(e) => handleNestedChange('children', index, 'name', e.target.value)}
                          style={{ padding: '10px', border: '2px solid #fee2e2', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' }}
                          required
                        />
                        <select
                          value={formData.children[index]?.month || ''}
                          onChange={(e) => handleNestedChange('children', index, 'month', e.target.value)}
                          style={{ padding: '10px', border: '2px solid #fee2e2', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' }}
                          required
                        >
                          <option value="">Month</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m}>
                              {new Date(2000, m - 1).toLocaleDateString('en-US', { month: 'short' })}
                            </option>
                          ))}
                        </select>
                        <select
                          value={formData.children[index]?.day || ''}
                          onChange={(e) => handleNestedChange('children', index, 'day', e.target.value)}
                          style={{ padding: '10px', border: '2px solid #fee2e2', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' }}
                          required
                        >
                          <option value="">Day</option>
                          {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <select
                          value={formData.children[index]?.year || ''}
                          onChange={(e) => handleNestedChange('children', index, 'year', e.target.value)}
                          style={{ padding: '10px', border: '2px solid #fee2e2', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' }}
                          required
                        >
                          <option value="">Year</option>
                          {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Sitters */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>👶</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Sitter/Caregiver</h3>
                </div>
                
                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '16px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff', marginBottom: '16px' }}>
                  <input
                    type="checkbox"
                    checked={hasSitters}
                    onChange={(e) => setHasSitters(e.target.checked)}
                    style={{ width: '24px', height: '24px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#374151' }}>
                    I will use a sitter/caregiver
                  </span>
                </label>

                {hasSitters && (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                      {[0, 1].map((index) => (
                        <input
                          key={index}
                          type="text"
                          placeholder={`Sitter/Caregiver #${index + 1} Name`}
                          value={formData.sitters[index]?.name || ''}
                          onChange={(e) => handleNestedChange('sitters', index, 'name', e.target.value)}
                          style={{ padding: '12px', border: '2px solid #dbeafe', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px' }}
                        />
                      ))}
                    </div>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff' }}>
                      <input
                        type="checkbox"
                        name="acceptSitterPolicy"
                        checked={formData.acceptSitterPolicy}
                        onChange={handleCheckboxChange}
                        style={{ marginTop: '4px', width: '20px', height: '20px', cursor: 'pointer' }}
                        required
                      />
                      <div style={{ fontSize: '13px', color: '#374151' }}>
                        I acknowledge the Sitter/Caregiver Policy *
                        <button
                          type="button"
                          onClick={() => setShowSitterPolicy(true)}
                          style={{ fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px', display: 'block', fontWeight: '600' }}
                        >
                          Read policy →
                        </button>
                      </div>
                    </label>
                  </>
                )}
              </section>

              {/* Policies */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>📜</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Policies</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff' }}>
                    <input
                      type="checkbox"
                      name="acceptMembershipRules"
                      checked={formData.acceptMembershipRules}
                      onChange={handleCheckboxChange}
                      style={{ marginTop: '4px', width: '20px', height: '20px', cursor: 'pointer' }}
                      required
                    />
                    <span style={{ fontSize: '13px', color: '#374151' }}>I accept the Membership Rules & FAQ *</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff' }}>
                    <input
                      type="checkbox"
                      name="acceptGuestPolicy"
                      checked={formData.acceptGuestPolicy}
                      onChange={handleCheckboxChange}
                      style={{ marginTop: '4px', width: '20px', height: '20px', cursor: 'pointer' }}
                      required
                    />
                    <div style={{ fontSize: '13px', color: '#374151' }}>
                      I accept the Guest Policy *
                      <button
                        type="button"
                        onClick={() => setShowGuestPolicy(true)}
                        style={{ fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px', display: 'block', fontWeight: '600' }}
                      >
                        Read policy →
                      </button>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff' }}>
                    <input
                      type="checkbox"
                      name="acceptPartyPolicy"
                      checked={formData.acceptPartyPolicy}
                      onChange={handleCheckboxChange}
                      style={{ marginTop: '4px', width: '20px', height: '20px', cursor: 'pointer' }}
                      required
                    />
                    <div style={{ fontSize: '13px', color: '#374151' }}>
                      I accept the Party Policy *
                      <button
                        type="button"
                        onClick={() => setShowPartyPolicy(true)}
                        style={{ fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', marginTop: '4px', display: 'block', fontWeight: '600' }}
                      >
                        Read policy →
                      </button>
                    </div>
                  </label>
                </div>
              </section>

              {/* Keyfob */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>🔑</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Gate Access</h3>
                </div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '16px', border: '2px solid #fee2e2', borderRadius: '8px', background: '#fef3f2', marginBottom: '12px' }}>
                  <input
                    type="checkbox"
                    name="needsKeyfob"
                    checked={formData.needsKeyfob}
                    onChange={handleCheckboxChange}
                    style={{ marginTop: '4px', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <div>
                    <p style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px', margin: 0 }}>I need a NEW keyfob (+$15)</p>
                    <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', margin: 0 }}>New members or lost keyfob</p>
                  </div>
                </label>
                {formData.needsKeyfob && (
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: '2px solid #fee2e2', borderRadius: '8px', background: '#fef3f2' }}>
                    <input
                      type="checkbox"
                      name="acceptKeyfobFee"
                      checked={formData.acceptKeyfobFee}
                      onChange={handleCheckboxChange}
                      style={{ marginTop: '4px', width: '20px', height: '20px', cursor: 'pointer' }}
                      required
                    />
                    <span style={{ fontSize: '13px', color: '#374151' }}>I agree to the $15 keyfob replacement fee *</span>
                  </label>
                )}
              </section>

              {/* Waiver */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>✍️</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Legal Agreement</h3>
                </div>
                {!hasReadTerms && (
                  <div style={{ padding: '16px', background: '#fef3f2', border: '2px solid #fca5a5', borderRadius: '8px', marginBottom: '16px' }}>
                    <p style={{ color: '#991b1b', fontSize: '14px', fontWeight: '600', margin: 0 }}>
                      ⚠️ You must read the waiver before agreeing
                    </p>
                  </div>
                )}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: hasReadTerms ? 'pointer' : 'not-allowed', padding: '16px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff', opacity: hasReadTerms ? 1 : 0.6, marginBottom: '12px' }}>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleCheckboxChange}
                    disabled={!hasReadTerms}
                    style={{ marginTop: '4px', width: '20px', height: '20px', cursor: hasReadTerms ? 'pointer' : 'not-allowed' }}
                    required
                  />
                  <div>
                    <p style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px', margin: 0 }}>
                      I have read and agree to the Waiver *
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      style={{ color: '#667eea', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', padding: 0, marginTop: '4px', fontWeight: '600' }}
                    >
                      Read full waiver
                    </button>
                  </div>
                </label>
              </section>

              {/* Adult Signatures */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>👤</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Signatures</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  {Array.from({ length: numAdults }).map((_, index) => (
                    <div key={index} style={{ padding: '20px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff' }}>
                      <p style={{ fontSize: '14px', fontWeight: '600', color: '#667eea', marginBottom: '16px' }}>Member #{index + 1}</p>
                      
                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Full Name *</label>
                        <input
                          type="text"
                          placeholder="First and Last Name"
                          value={formData.adultSignatures[index]?.name || ''}
                          onChange={(e) => handleNestedChange('adultSignatures', index, 'name', e.target.value)}
                          style={{ padding: '12px', border: '2px solid #dbeafe', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px', width: '100%' }}
                          required
                        />
                      </div>

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Draw Signature Below *</label>
                        <div style={{ border: '2px solid #dbeafe', borderRadius: '6px', background: 'white', cursor: 'crosshair', overflow: 'hidden' }}>
                          <canvas
                            ref={(el) => { if (el) canvasRefs[`sig-${index}`] = el; }}
                            width={400}
                            height={120}
                            onMouseDown={(e) => {
                              const canvas = canvasRefs[`sig-${index}`];
                              const ctx = canvas.getContext('2d');
                              const rect = canvas.getBoundingClientRect();
                              ctx.beginPath();
                              ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
                            }}
                            onMouseMove={(e) => {
                              if (e.buttons === 1) {
                                const canvas = canvasRefs[`sig-${index}`];
                                const ctx = canvas.getContext('2d');
                                const rect = canvas.getBoundingClientRect();
                                ctx.lineWidth = 2.5;
                                ctx.lineCap = 'round';
                                ctx.lineJoin = 'round';
                                ctx.strokeStyle = '#667eea';
                                ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
                                ctx.stroke();
                              }
                            }}
                            style={{ display: 'block', width: '100%', touchAction: 'none' }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const canvas = canvasRefs[`sig-${index}`];
                            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                          }}
                          style={{ fontSize: '12px', color: '#667eea', background: 'none', border: 'none', cursor: 'pointer', marginTop: '8px', textDecoration: 'underline', fontWeight: '600' }}
                        >
                          Clear signature
                        </button>
                      </div>

                      <div>
                        <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '600' }}>Date Signed (MM-DD-YYYY) *</label>
                        <input
                          type="text"
                          placeholder="MM-DD-YYYY"
                          value={formData.adultSignatures[index]?.date || ''}
                          onChange={(e) => handleNestedChange('adultSignatures', index, 'date', e.target.value)}
                          style={{ padding: '12px', border: '2px solid #dbeafe', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' }}
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Minor Signatures */}
              {numChildren > 0 && (
                <section>
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ fontSize: '28px', marginRight: '12px' }}>👶</div>
                    <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#764ba2', margin: 0 }}>Minor Member Waiver</h3>
                  </div>
                  <textarea
                    name="minorMemberNames"
                    placeholder="Names of all minors in household"
                    value={formData.minorMemberNames}
                    onChange={handleInputChange}
                    style={{ padding: '12px', border: '2px solid #f9a8d4', borderRadius: '8px', fontFamily: 'inherit', fontSize: '14px', minHeight: '60px', width: '100%', marginBottom: '12px', background: '#fdf0f6' }}
                  />
                  <div style={{ padding: '16px', border: '2px solid #f9a8d4', borderRadius: '8px', background: '#fdf0f6', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      name="parentGuardianName"
                      placeholder="Parent/Guardian Name *"
                      value={formData.parentGuardianName}
                      onChange={handleInputChange}
                      style={{ padding: '10px', border: '2px solid #f9a8d4', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '1 / -1' }}
                      required
                    />
                    <input
                      type="text"
                      name="parentGuardianSignature"
                      placeholder="Parent/Guardian Signature"
                      value={formData.parentGuardianSignature}
                      onChange={handleInputChange}
                      style={{ padding: '10px', border: '2px solid #f9a8d4', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px' }}
                    />
                    <input
                      type="text"
                      name="minorSignatureDate"
                      placeholder="Date (MM-DD-YYYY)"
                      value={formData.minorSignatureDate}
                      onChange={handleInputChange}
                      style={{ padding: '10px', border: '2px solid #f9a8d4', borderRadius: '6px', fontFamily: 'inherit', fontSize: '14px', gridColumn: '2 / -1' }}
                    />
                  </div>
                </section>
              )}

              {/* Membership & Payment */}
              <section>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '28px', marginRight: '12px' }}>💳</div>
                  <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#667eea', margin: 0 }}>Membership & Payment</h3>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '2px solid', borderColor: formData.membershipLevel === 'family' ? '#667eea' : '#e5e7eb', borderRadius: '8px', background: formData.membershipLevel === 'family' ? '#f0f4ff' : 'white', cursor: 'pointer', marginBottom: '12px' }}>
                    <input
                      type="radio"
                      name="membershipLevel"
                      value="family"
                      checked={formData.membershipLevel === 'family'}
                      onChange={handleInputChange}
                      style={{ marginRight: '12px', width: '20px', height: '20px' }}
                    />
                    <div>
                      <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px', margin: 0 }}>Family Membership</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>$600 (early) / $575 (check, Venmo, cash)</p>
                    </div>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', padding: '16px', border: '2px solid', borderColor: formData.membershipLevel === 'individual' ? '#667eea' : '#e5e7eb', borderRadius: '8px', background: formData.membershipLevel === 'individual' ? '#f0f4ff' : 'white', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="membershipLevel"
                      value="individual"
                      checked={formData.membershipLevel === 'individual'}
                      onChange={handleInputChange}
                      style={{ marginRight: '12px', width: '20px', height: '20px' }}
                    />
                    <div>
                      <p style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px', margin: 0 }}>Individual Membership</p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>$300/season</p>
                    </div>
                  </label>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>Payment Method</p>
                  <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', background: formData.paymentMethod === 'card' ? '#f0f4ff' : 'white' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={handleInputChange}
                      style={{ marginRight: '12px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>💳 Credit Card / PayPal</span>
                  </label>
                  <label style={{ display: 'flex', flexDirection: 'column', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', background: formData.paymentMethod === 'venmo' ? '#f0f4ff' : 'white' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="venmo"
                        checked={formData.paymentMethod === 'venmo'}
                        onChange={handleInputChange}
                        style={{ marginRight: '12px' }}
                      />
                      <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>💰 Venmo</span>
                    </div>
                    {formData.paymentMethod === 'venmo' && (
                      <div style={{ marginTop: '12px', padding: '16px', background: 'white', borderRadius: '6px', textAlign: 'center' }}>
                        <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '12px', fontWeight: '600' }}>Scan QR Code</p>
                        <div style={{ width: '180px', height: '180px', background: '#e5e7eb', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: '2px solid #d1d5db' }}>
                          <img 
                            src="/venmo-qr.png" 
                            alt="Venmo QR" 
                            style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '4px' }}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              if (target.parentElement) target.parentElement.innerHTML = '<p style="color: #9ca3af; font-size: 11px;">Add venmo-qr.png to /public/</p>';
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', padding: '12px', border: '2px solid #e5e7eb', borderRadius: '8px', cursor: 'pointer', background: formData.paymentMethod === 'check' ? '#f0f4ff' : 'white' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="check"
                      checked={formData.paymentMethod === 'check'}
                      onChange={handleInputChange}
                      style={{ marginRight: '12px' }}
                    />
                    <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>✉️ Check / Cash</span>
                  </label>
                </div>

                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer', padding: '12px', border: '2px solid #dbeafe', borderRadius: '8px', background: '#f0f4ff' }}>
                  <input
                    type="checkbox"
                    name="referral"
                    checked={formData.referral}
                    onChange={handleCheckboxChange}
                    style={{ marginTop: '4px', width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <div>
                    <p style={{ color: '#1f2937', fontWeight: '600', fontSize: '14px', margin: 0 }}>🎉 I'm referring a new family</p>
                    <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px', margin: 0 }}>Get $100 credit (credited to Venmo once both pay)</p>
                  </div>
                </label>
              </section>

              {/* Submit */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '16px', alignItems: 'end' }}>
                <div style={{ padding: '20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white' }}>
                  <p style={{ fontSize: '12px', margin: '0 0 8px 0' }}>Total Due:</p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', margin: 0 }}>
                    ${formData.membershipLevel === 'family' ? (formData.needsKeyfob ? 615 : 600) : (formData.needsKeyfob ? 315 : 300)}
                  </p>
                </div>
                <button
                  type="submit"
                  style={{
                    padding: '16px 48px',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                  }}
                >
                  Submit Registration →
                </button>
              </div>
            </form>

            {/* Admin Link */}
            <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '2px solid #e5e7eb', textAlign: 'center' }}>
              <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '8px' }}>👤 Admin?</p>
              <Link href="/admin" style={{ color: '#667eea', fontWeight: 'bold', textDecoration: 'none', fontSize: '14px' }}>
                Go to Admin Dashboard →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
