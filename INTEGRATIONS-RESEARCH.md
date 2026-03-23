# Smart & Door Integration Research Notes

**Research Date:** 2026-03-21  
**Status:** No official API found — alternatives documented

---

## What is Smart & Door?

"Smart & Door" is a consumer-grade WiFi-enabled smart lock/access device sold on Amazon. It's designed for personal use, likely for home gates, garage doors, or door locks.

### Key Characteristics
- Budget-friendly Amazon device
- WiFi connectivity
- Proprietary mobile app for control
- No public API documentation found
- Primarily designed for direct app control

---

## Research Attempts

### 1. Official API Documentation
**Result:** ❌ Not Found

- No official developer portal
- No API documentation on Smart & Door website (if exists)
- No GitHub repositories with SDK
- No open integration guide

### 2. GitHub Community Projects
**Result:** ⚠️ Limited

Search terms: `smart-door api`, `smart-door-lock integration`, `smart-door-unlock`

Likely to find:
- Reverse engineering attempts by hobbyists
- Home Assistant community integrations
- IFTTT workarounds
- But no official support

### 3. Home Assistant Integration
**Status:** 🔄 Check community

Home Assistant has a huge community. Check:
- [Home Assistant Integrations](https://www.home-assistant.io/integrations/)
- [Home Assistant Community Forums](https://community.home-assistant.io/)
- Search: "Smart Door" or exact device model

If available, you can use Home Assistant as a middleware to expose REST API.

### 4. IFTTT Support
**Status:** ✅ Likely Supported

Most WiFi smart home devices support IFTTT. Steps to verify:
1. Open Smart & Door app
2. Look for "Integrations" or "Connected Apps"
3. Search for IFTTT
4. If found, connect and create applet
5. Use IFTTT webhook to trigger from your app

---

## Integration Options Ranked by Viability

| Option | Viability | Effort | Cost | Notes |
|--------|-----------|--------|------|-------|
| **IFTTT Webhook** | ⭐⭐⭐⭐⭐ | Low | Free | Most likely to work immediately |
| **Manual Admin Action** | ⭐⭐⭐⭐⭐ | Low | Free | Always works, no integration needed |
| **Home Assistant** | ⭐⭐⭐ | High | $50-200 | Requires custom integration or reverse engineering |
| **Reverse Engineering** | ⭐⭐ | Very High | $0 | Risky, voids warranty, may break with app updates |
| **Commercial Lock Upgrade** | ⭐⭐⭐⭐ | Medium | $300-800 | Best long-term, Yale/August have proper APIs |

---

## IFTTT Integration Guide (If Supported)

### Step 1: Verify Device Support
1. Open Smart & Door app on phone
2. Navigate to Settings → Connected Apps or Integrations
3. Look for "IFTTT" option
4. If present: proceed to Step 2
5. If absent: try alternative approaches

### Step 2: Create IFTTT Applet

```
IF: Webhook → then_url.com/unlock
THEN: Smart & Door → Unlock Gate
```

**IFTTT Setup:**
1. Go to [ifttt.com](https://ifttt.com)
2. Create account (free)
3. Create new applet
4. Choose trigger: "Webhooks" service → "Receive a web request"
5. Set event name: `gate_unlock`
6. Choose action: Smart & Door → Unlock
7. Save applet
8. Copy webhook URL provided by IFTTT

### Step 3: Test Webhook

```bash
# Get your webhook URL from IFTTT (format below)
WEBHOOK_URL="https://maker.ifttt.com/trigger/gate_unlock/with/key/YOUR_KEY_HERE"

# Test it
curl -X POST "$WEBHOOK_URL"

# Should unlock gate within 1-2 seconds
```

### Step 4: Integrate into Cabana Club App

Store webhook URL in backend config (environment variable):
```bash
IFTTT_WEBHOOK_URL=https://maker.ifttt.com/trigger/gate_unlock/with/key/YOUR_KEY
```

Call from Node.js backend:
```javascript
const response = await fetch(process.env.IFTTT_WEBHOOK_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
});

if (response.ok) {
  console.log('Gate unlocked via IFTTT');
} else {
  console.error('IFTTT call failed');
}
```

---

## Home Assistant Integration (Fallback)

If IFTTT doesn't work, Home Assistant is the next option.

### Why Home Assistant?
- Supports many undocumented devices
- Active community reverse engineering
- Can expose REST API
- Works on local network (faster, more reliable)

### Setup Steps

```bash
# 1. Install Home Assistant (on Raspberry Pi or Docker)
docker run -d --name homeassistant \
  --network host \
  homeassistant/home-assistant:latest

# 2. Access at http://localhost:8123
# 3. Add Smart & Door integration if available
# 4. If not available, check community integrations

# 5. Create REST endpoint
# Configuration: automations.yaml
automation:
  - id: 'unlock_gate'
    trigger:
      platform: webhook
      webhook_id: gate_unlock_secret_id
    action:
      service: lock.unlock
      entity_id: lock.smart_door_gate

# 6. Expose via REST API
# POST http://home-assistant.local:8123/api/webhook/gate_unlock_secret_id
```

### Pros
- Works offline with local network
- Can manage multiple devices
- Proper API with authentication
- Audit logging built-in

### Cons
- Requires running separate server
- May need reverse engineering if no integration exists
- More infrastructure to maintain
- Potential legal concerns with reverse engineering

---

## Commercial Lock Alternatives (Future Upgrade)

If Smart & Door integration proves too difficult, consider upgrading to a commercial smart lock with proper API support:

### Tier 1: Professional Grade
- **Yale Connect** (commercial, API available)
- **Salto Systems** (enterprise, REST API)
- **Aperio** (commercial grade)
- Cost: $500-2000
- Features: Cloud API, audit logs, scheduling

### Tier 2: Consumer-Prosumer
- **August Home** (acquired by Yale, good API)
- **Level Lock** (retrofits existing locks)
- **Nuki** (European, REST API)
- Cost: $200-500
- Features: Cloud API, HomeKit/Google Home integration

### Tier 3: Budget (Current)
- Smart & Door (current)
- Various no-name Chinese brands
- Cost: $50-150
- Features: Mobile app only, limited integration

**Recommendation:** If you're planning to scale Bishop Estates Cabana Club, upgrading to a commercial lock with proper API would be better investment than engineering workarounds.

---

## Security Considerations

### Smart & Door Specific
1. **No encryption details available** — assume TLS only
2. **Authentication unclear** — likely app-based token
3. **No audit trail visible** — request logs may not exist
4. **Device security unknown** — firmware updates timing unknown

### IFTTT Approach
1. **API Key exposure risk** — store in environment variables, not code
2. **IFTTT account security** — use strong password, 2FA enabled
3. **Rate limiting** — IFTTT likely has limits (check docs)
4. **Webhook URL security** — don't share publicly

### Recommendations
- Always implement admin approval workflow (Phase 0)
- Log all unlock attempts
- Set up alerts for unusual activity
- Keep IFTTT key rotated
- Consider IP whitelisting for webhook calls

---

## Testing Checklist

### Before Phase 1 Implementation

- [ ] Confirm Smart & Door supports IFTTT (check app)
- [ ] Create IFTTT account and test applet manually
- [ ] Verify webhook triggers actual gate unlock
- [ ] Measure latency: record time from webhook to physical unlock
- [ ] Test failure scenarios: what happens if IFTTT is down?
- [ ] Verify Smart & Door app still works after IFTTT integration
- [ ] Check IFTTT rate limits and documented restrictions
- [ ] Review IFTTT terms of service for commercial use
- [ ] Get confirmation from Smart & Door support (if possible)

### For Home Assistant Option

- [ ] Check if Home Assistant integration exists
- [ ] If not, search GitHub for community reverse engineering projects
- [ ] Install and test Home Assistant locally
- [ ] Verify unlock functionality works end-to-end
- [ ] Test network reliability and fallback mechanisms
- [ ] Document setup procedures for future maintainers

---

## External Resources to Check

### IFTTT
- [IFTTT Webhooks Documentation](https://ifttt.com/maker_webhooks)
- [Smart & Door on IFTTT](https://ifttt.com/) — search for app

### Home Assistant
- [Home Assistant Official Docs](https://www.home-assistant.io/)
- [Custom Integrations Repository](https://github.com/hacs/integration)
- [Community Forums](https://community.home-assistant.io/)

### Smart Locks (Commercial Alternatives)
- [Yale Connect Developer Docs](https://developer.yale.com/)
- [August Home API](https://developer.august.com/)
- [Nuki REST API](https://developer.nuki.io/)

### General
- [WebSub/Webhooks Best Practices](https://www.w3.org/TR/websub/)
- [OAuth 2.0 if API exists](https://oauth.net/)

---

## Follow-Up Actions

### Immediate (Before MVP Release)
- [ ] Test IFTTT support on actual Smart & Door device
- [ ] Document exact steps for Bishop Estates staff
- [ ] Create manual unlock procedures (Phase 0 fallback)

### Post-MVP (Phase 1)
- [ ] Implement IFTTT automation if confirmed working
- [ ] Set up webhook endpoint in backend
- [ ] Implement audit logging
- [ ] Admin dashboard UI for unlock requests

### Long-term (Phase 2+)
- [ ] Research commercial lock upgrade options
- [ ] Cost-benefit analysis vs. IFTTT approach
- [ ] Plan migration strategy if switching locks

---

## Notes for Doug

If you have access to the Smart & Door device, these quick checks will save time:

1. **Open the app** and look for "Settings" or "Connected Apps"
2. **Search for IFTTT** — if it's there, we can integrate immediately
3. **If not**, check the app's Help section for API or automation docs
4. **If still nothing**, we proceed with manual admin approval (Phase 0) and upgrade later

This device might also support Alexa/Google Home — if so, there's a chance we can reverse-engineer the protocol, but IFTTT is always the easiest path.

---

**Last Updated:** 2026-03-21  
**Next Action:** Verify IFTTT support on device
