# Nexus Platform — Architecture & Component Documentation
## (Milestone 1: Setup & Familiarization)

## Tech Stack
- **Build tool:** Vite
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS (custom theme: primary/secondary/accent/success/warning/error palettes, Inter font, fade-in/slide-in animations)
- **Routing:** react-router-dom v6 (nested routes, `DashboardLayout` as a layout route)
- **State:** React Context (`AuthContext`) for auth; local component state + a mock in-memory "data layer" for everything else
- **Notifications:** react-hot-toast
- **File handling:** react-dropzone (uploads)
- **New (this phase):** react-calendar (scheduling UI), react-signature-canvas (e-signatures)

## Folder Structure
```
src/
  types/            # Shared TypeScript interfaces (User, Message, MeetingRequest, DealDocument, Transaction, ...)
  data/             # Mock "backend" — in-memory arrays + CRUD-style helper functions (simulates an API)
  context/          # AuthContext (login/register/logout, persisted to localStorage)
  components/
    ui/             # Reusable primitives: Button, Input, Card, Badge, Avatar
    layout/         # Navbar, Sidebar, DashboardLayout
    chat/           # ChatMessage, ChatUserList
    collaboration/  # CollaborationRequestCard
    entrepreneur/   # EntrepreneurCard
    investor/       # InvestorCard
    calendar/       # AvailabilityManager, MeetingRequestCard        (NEW)
    video/          # VideoCallUI                                    (NEW)
    documents/      # DocumentUpload, SignaturePad                   (NEW)
    payments/       # WalletCard, TransactionTable                   (NEW)
    security/       # PasswordStrengthMeter, OtpInput                (NEW)
    onboarding/     # Walkthrough                                    (NEW)
  pages/
    auth/           # Login, Register, ForgotPassword, ResetPassword, TwoFactor (NEW)
    dashboard/      # EntrepreneurDashboard, InvestorDashboard
    profile/        # EntrepreneurProfile, InvestorProfile
    investors/, entrepreneurs/, messages/, notifications/, settings/, help/, deals/, chat/
    calendar/       # CalendarPage                                   (NEW)
    video/          # VideoCallPage                                  (NEW)
    documents/      # DocumentsPage (rewritten — Document Chamber)   (UPDATED)
    payments/       # PaymentsPage                                   (NEW)
```

## Data Flow Pattern
There is no real backend. Every `data/*.ts` file exports:
1. An in-memory array acting as a "table" (e.g. `meetingRequests`, `dealDocuments`, `transactions`)
2. Helper functions that read/mutate that array and return plain objects, mimicking API calls (`getX`, `addX`, `updateX`)

Pages call these helpers inside `useMemo`/event handlers and keep a local `refreshKey` counter to force re-reads after a mutation, since the arrays are mutated in place rather than through a global store. This keeps the "backend swap" trivial later — every helper function is a natural place to drop in a real `fetch()`/axios call.

## Auth Flow
`AuthContext` (`login`, `register`, `logout`, `forgotPassword`, `resetPassword`, `updateProfile`) persists the current user to `localStorage` (`business_nexus_user`). Login/Register mock a network delay, then match against `data/users.ts`.

**New in this phase:** after a successful `login()`, `LoginPage` now redirects to `/two-factor` instead of the dashboard directly. `TwoFactorPage` accepts any 6-digit code (for demo purposes) and then completes the redirect — this satisfies the "multi-step login with 2FA mockup" requirement without needing a real OTP backend.

## Theming
Tailwind config (`tailwind.config.js`) already defines a full design-token scale (primary/secondary/accent/success/warning/error, each 50–950) plus the Inter font and `fade-in`/`slide-in` keyframes — this is the "consistent UI theme" referenced in Milestone 1 and is reused by every new component added in Weeks 1–3 (no new colors were introduced).

## Role-Based UI (Milestone 6)
Already present structurally and extended in this phase:
- `Sidebar.tsx` renders a different nav list for `entrepreneur` vs `investor` roles.
- `EntrepreneurDashboard` / `InvestorDashboard` are separate route targets.
- New nav entries (Calendar, Video Call, Payments) were added to **both** role-specific lists in Sidebar.tsx.
- `PaymentsPage` conditionally shows the "Fund Deal" action only for `investor` role.
