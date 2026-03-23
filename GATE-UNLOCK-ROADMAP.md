# Gate Unlock Feature - Roadmap & Quick Start

**TL;DR:** Smart & Door has no official API. We'll implement manual admin approval first (Phase 0), then automate with IFTTT or Home Assistant (Phase 1).

---

## What's Documented

✅ **INTEGRATIONS.md** — Full technical guide with 4 integration approaches  
✅ **INTEGRATIONS-RESEARCH.md** — Research findings and resources  
✅ **gate-unlock.placeholder.js** — Backend endpoint stubs  
✅ This file — Quick reference for Doug

---

## The Three Approaches (Ranked)

### 🥇 Phase 0: Manual Admin Approval (START HERE)
**Status:** Ready to implement now  
**Effort:** 2-3 days  
**Cost:** $0  
**How it works:**
1. Member requests gate unlock via app
2. Admin gets SMS/email notification
3. Admin reviews request (1-2 min decision)
4. Admin manually unlocks via Smart & Door app OR via our "Execute" button
5. System logs the event

**Why first?**
- Works immediately without Smart & Door API
- Adds security (human oversight)
- Can launch MVP with this
- Easy to test

**Admin Dashboard UI:**
```
┌─────────────────────────────────┐
│   GATE UNLOCK REQUESTS          │
├─────────────────────────────────┤
│ ▶ John Smith                    │
│   Phone: (555) 123-4567         │
│   Reason: Afternoon pool access │
│   [APPROVE & UNLOCK] [DENY]     │
│                                 │
│ ▶ Jane Doe                      │
│   Phone: (555) 987-6543         │
│   Reason: Event setup           │
│   [APPROVE & UNLOCK] [DENY]     │
└─────────────────────────────────┘
```

---

### 🥈 Phase 1: IFTTT Automation (IF SUPPORTED)
**Status:** Depends on Smart & Door app support  
**Effort:** 1-2 days  
**Cost:** Free (IFTTT free tier)  
**How it works:**
1. Smart & Door app has IFTTT integration
2. We create IFTTT applet: "webhook → unlock gate"
3. Admin clicks [APPROVE & UNLOCK] → directly calls webhook
4. Gate unlocks in 1-2 seconds, no manual app action needed
5. Manual override still available

**Prerequisites:**
1. Open Smart & Door app
2. Look for "Settings" → "Connected Apps" or "Integrations"
3. If you see IFTTT option → **we can do Phase 1**
4. If not → **stick with Phase 0**

**Quick Test (if IFTTT available):**
```bash
# Create IFTTT applet, get webhook URL, test:
curl -X POST "https://maker.ifttt.com/trigger/gate_unlock/with/key/YOUR_KEY"

# If gate unlocks → Ready to implement!
```

---

### 🥉 Phase 2: Home Assistant (FALLBACK)
**Status:** Only if IFTTT not available  
**Effort:** 1-2 weeks  
**Cost:** $50-200 (Raspberry Pi + Home Assistant)  
**How it works:**
1. Run Home Assistant on local network
2. Connect Smart & Door to Home Assistant
3. Expose REST API
4. App calls Home Assistant instead of IFTTT

**When to use:**
- IFTTT not available in Smart & Door app
- Want local network control (faster, more reliable)
- Planning to add other smart home devices later

---

## Quick Decision Tree

```
Do you have Smart & Door device now?
│
├─ YES
│  └─ Open app → Check "Settings" → Look for "IFTTT" or "Integrations"
│     │
│     ├─ IFTTT found?
│     │  ├─ YES → Implement Phase 1 after Phase 0 ✅
│     │  └─ NO → Implement Phase 0, optionally Phase 2 later
│     │
│     └─ Need unlock working in <1 week?
│        └─ YES → Do Phase 0 now, Phase 1 after
│
└─ NO (still shopping)
   └─ Buy Yale Connect or August Home instead (better APIs)
      OR proceed with Phase 0 + Phase 1 when device arrives
```

---

## Implementation Timeline

### Week 1: MVP with Phase 0 ✅
- Create `gate_unlock_requests` and `gate_unlock_events` tables
- Build 4 API endpoints (request, approve, deny, list)
- Add admin dashboard UI
- Wire up SMS/email notifications
- Write admin procedures doc
- Deploy and test

### Week 2-3: Phase 1 (IFTTT) ⚠️ *Conditional*
- Verify Smart & Door IFTTT support
- Create IFTTT applet
- Modify `/execute` endpoint to call webhook
- Test end-to-end
- Update deployment docs
- No code change needed if using existing Phase 0 structure

### Week 4+: Explore Phase 2 (Home Assistant) 🔮 *Optional*
- Only if Phase 1 doesn't work
- More complex, lower priority

---

## Implementation Checklist for Phase 0

### Database Setup
```sql
-- Run these migrations
CREATE TABLE gate_unlock_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by VARCHAR(255) NOT NULL,
  requester_phone VARCHAR(20),
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  unlock_reason TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  approved_by VARCHAR(255),
  approved_at TIMESTAMP,
  unlocked_at TIMESTAMP,
  notes TEXT
);

CREATE TABLE gate_unlock_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES gate_unlock_requests(id),
  event_type VARCHAR(50) NOT NULL,
  triggered_by VARCHAR(255) NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  details JSONB
);

CREATE INDEX idx_gate_unlock_requests_status ON gate_unlock_requests(status);
CREATE INDEX idx_gate_unlock_events_timestamp ON gate_unlock_events(timestamp DESC);
```

### Backend Endpoints
```
POST   /api/admin/gate/unlock/request         — Create request
GET    /api/admin/gate/unlock/requests        — List pending
POST   /api/admin/gate/unlock/approve/:id     — Approve request
POST   /api/admin/gate/unlock/deny/:id        — Deny request
POST   /api/admin/gate/unlock/execute/:id     — Execute unlock
GET    /api/admin/gate/unlock/audit           — View audit log
```

See `gate-unlock.placeholder.js` for detailed specs.

### Frontend (Admin Dashboard)
- [ ] Create "Gate Unlock" admin page
- [ ] Show pending requests queue
- [ ] [APPROVE & UNLOCK] and [DENY] buttons
- [ ] Display approval history
- [ ] Show recent unlock audit log
- [ ] Add simple stats (unlocks today, average response time)

### Notifications
- [ ] Send SMS to admin when request arrives
- [ ] Send email to requester when approved
- [ ] Send SMS/email to admin when unlock fails
- [ ] Log all notification attempts

### Operations
- [ ] Write admin procedure doc (how to approve/deny)
- [ ] Document fallback if system is down
- [ ] Create runbook for emergency unlock
- [ ] Set up email/SMS provider (Twilio, SendGrid, etc.)

---

## What Each File Does

| File | Purpose |
|------|---------|
| `INTEGRATIONS.md` | **Full technical reference** — 4 approaches, code examples, schema, testing strategy |
| `INTEGRATIONS-RESEARCH.md` | **Research findings** — why no API exists, alternatives, resources |
| `GATE-UNLOCK-ROADMAP.md` | **This file** — quick start and timeline for Doug |
| `gate-unlock.placeholder.js` | **API endpoint stubs** — copy this to start implementation |

---

## What You Need to Do

### Step 1: Verify IFTTT Support (Today)
1. Open Smart & Door app on your phone
2. Look in Settings → Connected Apps
3. Take a screenshot and send to dev team
4. **Result:** Go/no-go for Phase 1

### Step 2: Decide on Timeline (Today)
- MVP in 1 week? → Phase 0 only for now
- MVP in 2 weeks? → Phase 0 + Phase 1 prep
- MVP in 3 weeks? → Phase 0 + Phase 1 implementation

### Step 3: Notify Dev Team (Today)
Let them know:
- Phase 0 is required for MVP
- Phase 1 depends on IFTTT support
- Phase 0 takes ~3 days to implement

### Step 4: Review Before MVP (Before launch)
- [ ] Test request/approval/unlock flow manually
- [ ] Verify admin gets notifications
- [ ] Check audit log is being filled
- [ ] Test denial workflow
- [ ] Verify requester gets confirmation email

---

## Common Questions

**Q: Do I need Smart & Door API to implement this?**  
A: No. Phase 0 doesn't require it. Phase 1 might use IFTTT instead.

**Q: What if the Smart & Door device breaks/goes offline?**  
A: Manual override — admin uses Smart & Door app directly. System logs it anyway.

**Q: How long does it take to unlock?**  
A: Phase 0: ~2 minutes (admin decision time)  
Phase 1: ~1-2 seconds (IFTTT webhook)

**Q: Can members unlock themselves without admin?**  
A: Not in Phase 0. Phase 1 could support auto-unlock if IFTTT allows, but not recommended for gate security.

**Q: What if admin is not available?**  
A: Set up 2+ admins who get notifications. Or manual unlock via Smart & Door app.

**Q: Is this secure?**  
A: Yes. Every unlock is logged with timestamp and actor. Admin approval adds human security layer.

---

## Rollout Plan

### Pre-Launch (Testing)
1. Deploy Phase 0 to staging
2. Internal testing: admin team tests approval workflow
3. Test notifications work
4. Test audit log
5. Create admin runbook

### Launch (MVP)
1. Deploy Phase 0 to production
2. Enable for small group first (staff only)
3. Monitor for issues
4. Gradually open to members

### Post-Launch (Phase 1)
1. Check IFTTT support results
2. If yes: implement Phase 1 automation
3. Remove need for manual unlock (now automatic)
4. Celebrate! 🎉

---

## Success Metrics

- **Phase 0:** Admin approves requests in <3 min average
- **Phase 1:** Gate unlocks within 2 seconds of approval
- **Overall:** Zero security incidents, clear audit trail

---

## Next Steps

1. **Review INTEGRATIONS.md** if you need technical details
2. **Check Smart & Door app** for IFTTT support
3. **Email dev team** with Phase 0 green light
4. **Set expected launch date** (1-2 weeks from now)

---

**Questions?** Check INTEGRATIONS.md (technical) or INTEGRATIONS-RESEARCH.md (research details).

**Ready to build?** Have dev team start with Phase 0. Takes ~3 days.

---

*Documents prepared: 2026-03-21*  
*Confidence level: High (Phase 0) | Medium (Phase 1) | Low (Phase 2)*
