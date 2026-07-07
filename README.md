# Business Nexus — Phase 2 Enhancements

This document covers the features added on top of the base Nexus platform as part of the Advanced Frontend Internship Tasks (Weeks 1–3).

**Live demo:** https://nexus-alpha-sooty.vercel.app/

## Tech Additions

New libraries introduced in this phase:
- `react-calendar` — meeting scheduler UI
- `react-signature-canvas` — e-signature pad

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

After logging in, you'll be routed through a mock **Two-Factor Authentication** step — any 6-digit code is accepted.

### Build for production
```bash
npm run build
npm run preview
```

## Features Added

### Week 1 — Meeting Scheduler (Calendar)
- Interactive calendar to view and select dates
- Set and remove personal availability slots
- Send meeting requests to any connected user
- Accept or decline incoming meeting requests
- Confirmed meetings displayed on the selected calendar date

### Week 2 — Video Calling
- Start / end call UI with live local camera preview (`getUserMedia`)
- Mic and camera toggle controls
- Screen sharing (`getDisplayMedia`)
- Mock remote participant panel

### Week 2 — Document Chamber
- Drag-and-drop document upload
- Inline preview for PDFs and images
- E-signature pad for signing documents
- Status pipeline: **Draft → In Review → Signed**

### Week 3 — Payments (simulated)
- Wallet balance display
- Deposit / withdraw / transfer between users
- Transaction history table
- Investor → Entrepreneur funding deal flow

### Week 3 — Security
- Password strength meter on registration
- Mock OTP-based two-factor authentication after login
- Role-based access to features (e.g. only investors can initiate funding deals)

### Week 3 — Integration & Onboarding
- New features wired into main navigation for both Entrepreneur and Investor roles
- One-time guided walkthrough shown on first dashboard visit, introducing all new modules

## New File Locations

```
src/data/meetings.ts
src/data/documents.ts
src/data/transactions.ts

src/components/calendar/
src/components/video/
src/components/documents/
src/components/payments/
src/components/security/
src/components/onboarding/

src/pages/calendar/CalendarPage.tsx
src/pages/video/VideoCallPage.tsx
src/pages/payments/PaymentsPage.tsx
src/pages/auth/TwoFactorPage.tsx
```

See `ARCHITECTURE.md` for the full component/data-flow breakdown.

## Notes

All features above are frontend-only simulations built for this internship curriculum. Video calls, payments, e-signatures, and 2FA do not connect to any real backend, payment processor, WebRTC peer, or SMS/OTP service. Data is held in-memory and resets on page reload (except the logged-in user, which persists to `localStorage`).

## Deployment

Deployed on Vercel. `vercel.json` includes the rewrite rule required for client-side routing to work correctly on page refresh or direct navigation to nested routes:

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
```
