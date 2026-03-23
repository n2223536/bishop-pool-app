# Smart & Door Gate Unlock Integration Guide

## Overview

This document outlines the integration path for remote gate unlock functionality via the "Smart & Door" WiFi smart lock device. Currently in **FUTURE scope** (not MVP), but documented for future implementation.

**Status:** Research phase — no official Smart & Door API found. Alternative approaches recommended below.

---

## Research Findings

### Official Smart & Door API
After extensive research, **no official API documentation was found** for Smart & Door devices. The app appears to be a consumer-grade Amazon smart home device with limited third-party integration options.

**Key Challenge:** Smart & Door devices are typically locked to their proprietary mobile app, with no documented RESTful API or OAuth2 authentication scheme.

---

## Recommended Integration Approaches

### Approach 1: IFTTT Webhook (Recommended - Simplest)

**Status:** ✅ **VIABLE** if Smart & Door supports IFTTT

**How it works:**
1. Check if Smart & Door device supports IFTTT integration via the Smart & Door app
2. Create an IFTTT applet: "If webhook → Then unlock gate"
3. Store IFTTT webhook URL and API key in backend config
4. Admin dashboard sends webhook request to trigger unlock

**Advantages:**
- No API key management needed (IFTTT handles auth)
- No direct device communication required
- Rate limiting built-in by IFTTT
- Audit trail available via IFTTT logs

**Disadvantages:**
- Depends on IFTTT support (not guaranteed)
- ~1-2 second latency through IFTTT
- IFTTT account required

**Implementation Checklist:**
- [ ] Verify Smart & Door supports IFTTT integration
- [ ] Create IFTTT account for Bishop Estates Cabana Club
- [ ] Set up webhook applet
- [ ] Test unlock flow end-to-end
- [ ] Document IFTTT applet configuration

---

### Approach 2: Home Assistant Integration (Fallback)

**Status:** 🔄 **POTENTIAL** if device has local network API

**How it works:**
1. Install Home Assistant on local network
2. Use Home Assistant's Smart & Door integration (if available) or reverse-engineered driver
3. Expose Home Assistant API (REST or WebSocket)
4. Cabana Club app calls Home Assistant API instead of device directly

**Advantages:**
- Local network communication (faster, more reliable)
- Home Assistant can manage multiple devices
- Built-in logging and automation rules
- Can work offline with proper setup

**Disadvantages:**
- Requires running Home Assistant server
- Reverse-engineering may be needed
- More infrastructure to maintain
- Potential legal/ToS concerns with reverse engineering

**Implementation Checklist:**
- [ ] Research if Home Assistant has Smart & Door integration
- [ ] If not, check community integrations (GitHub)
- [ ] Deploy Home Assistant on local Raspberry Pi or server
- [ ] Integrate Smart & Door device
- [ ] Create REST API endpoint for gate unlock
- [ ] Add authentication/authorization layer

---

### Approach 3: Manual Trigger + Admin Review (MVP-Friendly)

**Status:** ✅ **VIABLE NOW** (workaround for MVP)

**How it works:**
1. Admin dashboard has "Request Gate Unlock" button
2. Request goes to backend and logs entry
3. Admin receives SMS/email notification
4. Admin manually unlocks via Smart & Door app
5. System logs unlock time and admin who approved

**Advantages:**
- Works immediately, no Smart & Door API needed
- Good audit trail for security
- Human oversight of every unlock
- No complex integration required

**Disadvantages:**
- Not automated/immediate
- Requires admin action for every unlock
- Doesn't scale for high-volume use cases
- No remote unlock automation

**Implementation Checklist:**
- [ ] Add "Request Gate Unlock" button to admin dashboard
- [ ] Create unlock request form (requester name, phone, reason)
- [ ] Set up SMS/email notification to admin
- [ ] Create unlock audit log in database
- [ ] Add approval/denial workflow

---

### Approach 4: Custom Device Firmware (Advanced)

**Status:** ❌ **NOT RECOMMENDED** for MVP

If Smart & Door device firmware is flashable, could install custom code to expose local API. Not recommended because:
- Voids device warranty
- Breaks Smart & Door app functionality
- Legal/ToS concerns
- High maintenance burden

---

## Recommended Timeline & Phasing

### Phase 0: MVP (Now)
- Implement **Approach 3** (Manual Trigger with Admin Review)
- Get the gate unlock feature working with human oversight
- Focus on app core functionality

### Phase 1: Post-MVP (Next Quarter)
- Try **Approach 1** (IFTTT)
- If Smart & Door supports IFTTT, add automated webhook integration
- Keep manual override available for edge cases

### Phase 2: Long-term (Future)
- If IFTTT doesn't work, evaluate **Approach 2** (Home Assistant)
- Consider upgrading to commercial smart lock with proper API (Yale, August, Schlage)

---

## Backend Placeholder Implementation

### Database Schema

```sql
-- Unlock requests table
CREATE TABLE gate_unlock_requests (
  id UUID PRIMARY KEY,
  requested_by VARCHAR(255) NOT NULL,           -- Resident name
  requester_phone VARCHAR(20),                   -- Contact phone
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unlock_reason TEXT,                            -- Why they need unlock
  status ENUM('pending', 'approved', 'denied', 'completed') DEFAULT 'pending',
  approved_by VARCHAR(255),                      -- Admin who approved
  approved_at TIMESTAMP,
  unlocked_at TIMESTAMP,                         -- When unlock actually occurred
  notes TEXT
);

-- Unlock audit log
CREATE TABLE gate_unlock_events (
  id UUID PRIMARY KEY,
  request_id UUID REFERENCES gate_unlock_requests(id),
  event_type ENUM('requested', 'approved', 'denied', 'unlocked', 'failed') NOT NULL,
  triggered_by VARCHAR(255),                     -- User/system that triggered
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSON                                   -- Extra context
);
```

### API Endpoints (Phase 0 - Manual)

```
POST /api/admin/gate/unlock/request
  Body: { requesterName, requesterPhone, reason }
  Response: { requestId, status: 'pending' }

GET /api/admin/gate/unlock/requests
  Response: [ { id, requesterName, status, requestedAt, reason } ]

POST /api/admin/gate/unlock/approve/:id
  Body: { notes }
  Response: { status: 'approved', approvedAt }

POST /api/admin/gate/unlock/deny/:id
  Body: { reason }
  Response: { status: 'denied', deniedAt }

POST /api/admin/gate/unlock/execute/:id
  Body: { }
  Response: { status: 'unlocked', unlockedAt }
  Note: Calls IFTTT webhook or triggers actual unlock
```

### API Endpoints (Phase 1 - IFTTT Automation)

```
POST /api/admin/gate/unlock/auto
  Body: { requesterPhone, reason }
  Response: { status: 'unlocked', timestamp }
  Note: Directly calls IFTTT webhook, logs to database
```

---

## Configuration & Secrets

### Environment Variables

```bash
# Phase 0 (Manual)
ADMIN_NOTIFICATION_EMAIL=president@bishopestates.local
ADMIN_NOTIFICATION_PHONE=+1234567890

# Phase 1 (IFTTT)
IFTTT_WEBHOOK_URL=https://maker.ifttt.com/trigger/gate_unlock/with/key/{KEY}
IFTTT_API_KEY=your_ifttt_key_here
IFTTT_RATE_LIMIT_PER_HOUR=60

# Phase 2 (Home Assistant)
HOME_ASSISTANT_URL=http://home-assistant.local:8123
HOME_ASSISTANT_TOKEN=long_lived_token
HOME_ASSISTANT_ENTITY_ID=lock.gate_entrance
```

---

## Frontend Placeholder (Admin Dashboard)

### Phase 0 - Manual Unlock Request UI

```jsx
// Admin Dashboard Component: GateUnlock.jsx

export function GateUnlockPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnlockRequests();
  }, []);

  const fetchUnlockRequests = async () => {
    const res = await fetch('/api/admin/gate/unlock/requests');
    setRequests(await res.json());
  };

  const approveUnlock = async (requestId) => {
    await fetch(`/api/admin/gate/unlock/approve/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ notes: 'Approved' })
    });
    fetchUnlockRequests();
  };

  const denyUnlock = async (requestId) => {
    await fetch(`/api/admin/gate/unlock/deny/${requestId}`, {
      method: 'POST',
      body: JSON.stringify({ reason: 'Not approved' })
    });
    fetchUnlockRequests();
  };

  return (
    <div className="gate-unlock-panel">
      <h2>Gate Unlock Requests</h2>
      
      <div className="unlock-queue">
        {requests.filter(r => r.status === 'pending').map(req => (
          <div key={req.id} className="request-card">
            <div className="requester-info">
              <strong>{req.requesterName}</strong>
              <p>Phone: {req.requesterPhone}</p>
              <p>Reason: {req.reason}</p>
              <small>Requested: {new Date(req.requestedAt).toLocaleString()}</small>
            </div>
            <div className="actions">
              <button onClick={() => approveUnlock(req.id)} className="btn-approve">
                Approve & Unlock
              </button>
              <button onClick={() => denyUnlock(req.id)} className="btn-deny">
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="audit-log">
        <h3>Recent Activity</h3>
        {requests.slice(0, 10).map(req => (
          <div key={req.id} className="audit-entry">
            <span>{req.requesterName}</span>
            <span>{req.status}</span>
            <span>{new Date(req.requestedAt).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Security Considerations

### Authentication & Authorization
- ✅ Only admins can approve/deny unlocks
- ✅ Only president can execute manual unlocks (or designated admin)
- ✅ All unlock actions logged with timestamp, actor, reason
- ✅ IFTTT webhook key stored securely (environment variable, not in code)

### Rate Limiting
- ⚠️ Limit unlocks to max 5 per hour per resident (prevent spam)
- ⚠️ Log failed unlock attempts
- ⚠️ Alert admin if multiple failures detected (possible security breach)

### Audit Trail
- ✅ Every unlock request logged
- ✅ Every approval/denial logged
- ✅ Every actual unlock logged with timestamp
- ✅ Export audit log monthly for compliance

---

## Testing Strategy

### Phase 0 (Manual)
```bash
# Test unlock request creation
POST /api/admin/gate/unlock/request
{ "requesterName": "Test User", "requesterPhone": "+1234567890", "reason": "Test" }

# Test approval workflow
POST /api/admin/gate/unlock/approve/{requestId}
{ "notes": "Approved for testing" }

# Verify notification sent (check email/SMS logs)
# Verify database entries created
# Verify admin dashboard shows pending requests
```

### Phase 1 (IFTTT)
```bash
# Test IFTTT webhook connectivity
curl -X POST $IFTTT_WEBHOOK_URL

# Test end-to-end: request → approval → execution
# Verify Smart & Door app shows gate unlocked
# Check latency: <3 seconds expected
```

---

## Troubleshooting & Fallback Plan

| Issue | Solution |
|-------|----------|
| IFTTT webhook fails | Fall back to manual unlock via Smart & Door app |
| Admin never receives notification | Check email/SMS provider logs, update contact info |
| Gate doesn't unlock after approval | Verify Smart & Door device is powered/connected, try manual app unlock |
| Request queue backs up | President manually handles high-volume unlock days |
| Device goes offline | Implement geo-fencing to detect when gate should be pre-unlocked |

---

## Future Enhancements

1. **Upgrade to Commercial Smart Lock**
   - Switch to Yale Connect or August Home (proper APIs)
   - Better integration with HomeKit/Google Home
   - Cloud API + local fallback

2. **Biometric Access**
   - Add fingerprint/face recognition to gate
   - Integrate with member database
   - Remove need for unlock requests entirely

3. **Geofencing Automation**
   - Auto-unlock when member approaches (if they have app)
   - Configurable radius and time windows
   - Safety override: always require code entry

4. **Integration with Reservation System**
   - Auto-unlock during scheduled pool hours
   - Unlock 30 min before event time
   - Reduce manual requests for known guests

---

## Summary

| Approach | MVP Ready | Effort | Cost | Security | Recommendation |
|----------|-----------|--------|------|----------|---|
| Manual (Approach 3) | ✅ Yes | Low | $0 | High | Start here |
| IFTTT (Approach 1) | 🔄 If available | Low | Free | Good | Try next |
| Home Assistant (Approach 2) | ⚠️ Complex | High | $0-200 | Good | Long-term |
| Custom Firmware (Approach 4) | ❌ No | Very High | $0 | Unknown | Not recommended |

**Recommendation:** Implement **Approach 3** (Manual with Admin Review) for MVP, with a clear path to IFTTT automation in Phase 1.

---

## Next Steps

1. **Verify Smart & Door IFTTT Support**
   - Check Smart & Door app settings for IFTTT
   - Try creating a test IFTTT applet

2. **Implement Manual Unlock Workflow** (if Phase 0)
   - Create database tables
   - Build API endpoints
   - Add admin dashboard UI

3. **Document Admin Procedures**
   - How to approve/deny requests
   - When to use manual override
   - Escalation path for edge cases

4. **Set Up Audit Logging**
   - All unlock events logged
   - Monthly compliance reports
   - Alert on suspicious activity

---

**Document Version:** 1.0  
**Last Updated:** 2026-03-21  
**Next Review:** After Phase 0 implementation
